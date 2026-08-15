<template>
  <a
    class="site-card"
    :href="site.url"
    target="_blank"
    rel="noopener"
    @contextmenu.prevent="onContextMenu"
    :title="site.desc || site.name"
  >
    <div class="card-icon">
      <img
        v-if="showImg"
        :src="currentSrc"
        alt=""
        loading="lazy"
        draggable="false"
        @error="onImgError"
      />
      <span v-else class="card-initial" :style="{ background: initialColor }">{{ initial }}</span>
    </div>
    <div class="card-info">
      <p class="card-name">{{ site.name }}</p>
      <p v-if="site.desc" class="card-desc">{{ site.desc }}</p>
    </div>
  </a>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ContextMenu from '@imengyu/vue3-context-menu'
import {
  faviconCandidates,
  getCachedIndex,
  cacheResolvedIndex,
  initialOf,
  colorFromString,
} from '@/utils/icon'
import { extractDomain } from '@/utils/url'

const props = defineProps({
  site: { type: Object, required: true },
})
const emit = defineEmits(['edit', 'remove'])

const candidates = computed(() => faviconCandidates(props.site))
const domain = computed(() => extractDomain(props.site.url))

const idx = ref(0)
const showImg = ref(true)

const initial = computed(() => initialOf(props.site.name))
const initialColor = computed(() => colorFromString(props.site.name))

onMounted(() => {
  const cached = getCachedIndex(domain.value)
  if (cached === null) return
  if (cached === -1) {
    showImg.value = false
  } else if (cached < candidates.value.length) {
    idx.value = cached
  }
})

const currentSrc = computed(() => candidates.value[idx.value] ?? '')

function onImgError() {
  idx.value++
  if (idx.value >= candidates.value.length) {
    showImg.value = false
    cacheResolvedIndex(domain.value, -1)
  } else {
    cacheResolvedIndex(domain.value, idx.value)
  }
}

function onContextMenu(e) {
  ContextMenu.showContextMenu({
    x: e.clientX,
    y: e.clientY,
    items: [
      { label: '编辑', onClick: () => emit('edit', props.site) },
      { label: '删除', onClick: () => emit('remove', props.site) },
    ],
  })
}
</script>

<style scoped>
.site-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  padding: 14px 10px 12px;
  border-radius: 15px;
  text-decoration: none;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease;
}
.site-card:hover {
  transform: translateY(-3px);
  background: var(--card-bg-hover);
  border-color: var(--card-border-hover);
  box-shadow: var(--card-shadow);
}

.card-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--icon-bg);
  overflow: hidden;
  flex-shrink: 0;
}
.card-icon img {
  width: 29px;
  height: 29px;
  object-fit: contain;
}
.card-initial {
  width: 29px;
  height: 29px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 700;
  color: #fff;
}

.card-info {
  width: 100%;
  text-align: center;
}
.card-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.card-desc {
  margin-top: 2px;
  font-size: 11px;
  line-height: 1.5;
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
