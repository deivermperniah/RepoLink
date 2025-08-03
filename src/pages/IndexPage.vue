<template>
  <q-page class="q-pa-md">
    <div v-if="loading" class="flex flex-center column">
      <q-spinner size="xl" color="amber-9"/>
      <div class="q-mt-md text-weight-medium text-subtitle1">Cargando...</div>
    </div>
    <div v-else>
      <div v-if="links.length">
        <q-list bordered v-for="link in links" :key="link.id" class="q-mb-md rounded-borders">
          <q-item class="item">
            <q-item-section avatar>
              <q-avatar>
                <img src="../assets/logo-github.png" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-weight-medium text-subtitle1 ellipsis">{{ link.name }}</q-item-label>
              <q-item-label class="text-amber-9 ellipsis" caption>{{ link.url }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <div>
                <q-btn dense flat icon="folder" class="text-blue-grey-8" @click="navegateUrl(link.url)"/>
                <q-btn dense flat icon="delete" class="text-red" @click="openDeleteModal(link.id)"/>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <div v-else class="text-center">
        <img src="../assets/Setup-rafiki.svg" style="width: 200px;">
        <div class="text-weight-medium text-subtitle1">Presiona el boton <q-icon name="add" color="amber-9"/> y guarda un nuevo repositorio 📁</div>
      </div>
    </div>

    <q-dialog v-model="showModal">
        <q-card>
          <q-card-section>
            ¿Deseas eliminar el repositorio?
          </q-card-section>

          <q-card-actions align="right" class="q-px-md q-pt-none q-pb-md">
            <q-btn no-caps flat label="Cancelar" @click="showModal = false" />
            <q-btn no-caps flat label="Eliminar" color="red" :loading="loadingDelete" @click="deleteLinks(selectedId)" />
          </q-card-actions>
        </q-card>
      </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { supabase } from '../supabase'
import { eventBus } from '../eventBus'

const $q = useQuasar()

const links = ref([])

const selectedId = ref(null)

const loading = ref(false)

const loadingDelete= ref(false)

const showModal = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const { data, error } = await supabase.from('repository').select('*')

    if (error) {
      throw error
    }

    links.value = data
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: `Error al cargar los repositorios: ${error.message}`,
      position: 'bottom-right',
      timeout: 1000,
    })
  } finally {
    loading.value = false
  }

  eventBus.on('repo-added', (newRepo) => {
    links.value.push(newRepo)
  })
})

const deleteLinks = async (id) => {
  loadingDelete.value = true
  try {
    const { error } = await supabase.from('repository').delete().eq('id', id)

    if (error) {
      throw error
    }

    links.value = links.value.filter((link) => link.id !== id)

    $q.notify({
      type: 'positive',
      message: 'Repositorio eliminado correctamente',
      position: 'bottom-right',
      timeout: 1000,
    })

    showModal.value = false
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: `Error al eliminar el repositorio: ${error.message}`,
      position: 'bottom-right',
      timeout: 1000,
    })
  } finally {
    loadingDelete.value = false
  }
}

const openDeleteModal = (id) => {
  selectedId.value = id
  showModal.value = true
}

const navegateUrl = (url) => {
  window.open(url, '_blank')
}
</script>

<style scoped>
.item:hover {
  box-shadow: 0px 0px 5px rgb(0,0,0);
  border-radius: 3px;
}
</style>
