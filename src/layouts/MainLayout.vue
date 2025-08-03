<template>
  <!--
   FIXME:
    - Arreglar que las notificaciones se muestre a un lado en la pantalla grande y en la pequeña en el centro
    - Arreglar que la imagen que se muestra cuando no hay repositorios sea responsive

    TODO:
    - Colocar un boton de informacion que muestre el dueño del repo en nombre y la url
  -->
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-amber-9">
        <q-toolbar-title> RepoLink </q-toolbar-title>
        <q-btn flat dense icon="add" @click="showModal = true" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-dialog v-model="showModal">
        <q-card :style="$q.screen.lt.sm ? 'min-width: 300px' : 'min-width: 500px'">
          <q-card-section>
            <q-input outlined color="amber-9" v-model="inputValue" label="Ingrese el link" />
          </q-card-section>

          <q-card-actions align="right" class="q-px-md q-pt-none q-pb-md">
            <q-btn no-caps flat label="Cancelar" @click="showModal = false" />
            <q-btn
              no-caps
              flat
              label="Guardar"
              color="green"
              :loading="loadingSave"
              @click="saveLink"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { supabase } from '../supabase'
import { eventBus } from '../eventBus'

const $q = useQuasar()

const showModal = ref(false)

const inputValue = ref('')

const loadingSave = ref(false)

const saveLink = async () => {
  const githubUrlRegex = /^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/

  if (!githubUrlRegex.test(inputValue.value)) {
    $q.notify({
      type: 'negative',
      message: 'URL inválida',
      position: 'bottom-right',
      timeout: 1000,
    })
    return
  }

  const urlParts = inputValue.value.split('/')
  const repoName = urlParts[urlParts.length - 1]

  loadingSave.value = true

  try {
    const { data, error } = await supabase
      .from('repository')
      .insert([{ name: repoName, url: inputValue.value }])
      .select()

    if (error) {
      throw error
    }

    eventBus.emit('repo-added', data[0])

    $q.notify({
      type: 'positive',
      message: 'Link guardado',
      position: 'bottom-right',
      timeout: 1000,
    })

    showModal.value = false

    inputValue.value = ''
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: `Error al guardar: ${error.message}`,
      position: 'bottom-right',
      timeout: 1000,
    })
  } finally {
    loadingSave.value = false
  }
}
</script>
