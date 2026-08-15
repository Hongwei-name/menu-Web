<template>
  <section class="category-section" :id="`cat-${category.id}`">
    <div class="section-header">
      <h2 class="section-title">
        <span class="title-dot" :style="{ background: settings.settings.accent }"></span>
        {{ category.name }}
      </h2>
      <span class="section-count">{{ sites.length }} 个站点</span>
    </div>
    <div class="section-grid">
      <SiteCard
        v-for="site in sites"
        :key="site.id"
        :site="site"
        @edit="emit('edit', $event)"
        @remove="emit('remove', $event)"
      />
      <button class="add-card" type="button" @click="emit('add', category.id)">
        <span class="add-icon">＋</span>
        <span class="add-text">添加站点</span>
      </button>
    </div>
  </section>
</template>

<script setup>
import SiteCard from './SiteCard.vue'
import { useSettingsStore } from '@/stores/settings'

defineProps({
  category: { type: Object, required: true },
  sites: { type: Array, default: () => [] },
})
const emit = defineEmits(['add', 'edit', 'remove'])

const settings = useSettingsStore()
</script>

<style scoped>
.category-section {
  scroll-margin-top: 140px; /* 锚点跳转避开吸顶导航 */
  margin-bottom: 22px;
}

.section-header {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 10px;
}
.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.5px;
}
.title-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}
.section-count {
  font-size: 12px;
  color: var(--text-secondary);
}

.section-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 13px;
}

.add-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 96px;
  border-radius: 15px;
  border: 1.5px dashed var(--card-border);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition:
    color 0.2s,
    border-color 0.2s,
    background 0.2s,
    transform 0.2s;
}
.add-card:hover {
  color: var(--accent);
  border-color: var(--accent);
  background: var(--card-bg);
  transform: translateY(-2px);
}
.add-icon {
  font-size: 20px;
  line-height: 1;
}
.add-text {
  font-size: 12px;
}
</style>
