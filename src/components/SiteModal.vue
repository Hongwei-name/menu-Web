<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="modelValue" class="modal-mask" @click.self="close">
        <div class="modal-box" role="dialog" aria-modal="true" :aria-label="isEdit ? '编辑站点' : '添加站点'">
          <h3 class="modal-title">{{ isEdit ? '编辑站点' : '添加站点' }}</h3>

          <div class="form-item">
            <label>网站名称 <em>*</em></label>
            <input v-model="form.name" type="text" placeholder="例如：GitHub" @keyup.enter="submit" />
          </div>

          <div class="form-item">
            <label>网站地址 <em>*</em></label>
            <input v-model="form.url" type="text" placeholder="例如：github.com 或 https://github.com" @keyup.enter="submit" />
          </div>

          <div class="form-item">
            <label>一句话描述</label>
            <input v-model="form.desc" type="text" placeholder="选填，例如：代码托管平台" @keyup.enter="submit" />
          </div>

          <div class="form-item">
            <label>自定义图标 URL（选填）</label>
            <input v-model="form.icon" type="text" placeholder="留空则自动获取 favicon" @keyup.enter="submit" />
          </div>

          <div class="form-item">
            <label>所属分类</label>
            <select v-model="form.categoryId">
              <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>

          <p v-if="error" class="form-error">{{ error }}</p>

          <div class="modal-btns">
            <button class="btn btn-ghost" type="button" @click="close">取消</button>
            <button class="btn btn-primary" type="button" @click="submit">{{ isEdit ? '保存修改' : '确认添加' }}</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { normalizeUrl } from '@/utils/url'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  site: { type: Object, default: null }, // 编辑时传入，新增为 null
  categories: { type: Array, default: () => [] },
  defaultCategoryId: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue', 'submit'])

const form = reactive({ name: '', url: '', desc: '', icon: '', categoryId: '' })
const error = ref('')

const isEdit = computed(() => !!props.site)

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return
    error.value = ''
    const s = props.site
    if (s) {
      form.name = s.name
      form.url = s.url
      form.desc = s.desc ?? ''
      form.icon = s.icon ?? ''
      form.categoryId = s.categoryId
    } else {
      form.name = ''
      form.url = ''
      form.desc = ''
      form.icon = ''
      form.categoryId = props.defaultCategoryId || props.categories[0]?.id || ''
    }
  },
)

function close() {
  emit('update:modelValue', false)
}

function submit() {
  const name = form.name.trim()
  const url = form.url.trim()
  if (!name) {
    error.value = '请输入网站名称'
    return
  }
  if (!url) {
    error.value = '请输入网站地址'
    return
  }
  emit('submit', {
    name,
    url: normalizeUrl(url),
    desc: form.desc.trim(),
    icon: form.icon.trim(),
    categoryId: form.categoryId,
  })
}
</script>

<style scoped>
.modal-mask {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: var(--mask-bg);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-box {
  width: min(440px, 100%);
  max-height: 90vh;
  overflow-y: auto;
  padding: 26px 28px;
  border-radius: 18px;
  background: var(--panel-bg);
  border: 1px solid var(--card-border);
  box-shadow: var(--card-shadow);
  backdrop-filter: blur(20px);
}

.modal-title {
  margin: 0 0 22px;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
}

.form-item {
  margin-bottom: 16px;
}
.form-item label {
  display: block;
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 7px;
}
.form-item label em {
  color: var(--danger, #ef4444);
  font-style: normal;
}
.form-item input,
.form-item select {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 13px;
  border: 1px solid var(--card-border);
  border-radius: 10px;
  background: var(--input-bg);
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.form-item input:focus,
.form-item select:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent);
}

.form-error {
  margin: 0 0 6px;
  font-size: 12px;
  color: #ef4444;
}

.modal-btns {
  margin-top: 22px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
.btn {
  padding: 9px 22px;
  border-radius: 10px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}
.btn-ghost {
  background: transparent;
  border-color: var(--card-border);
  color: var(--text-secondary);
}
.btn-ghost:hover {
  background: var(--engine-bg-hover);
  color: var(--text-primary);
}
.btn-primary {
  background: var(--accent);
  color: #fff;
}
.btn-primary:hover {
  filter: brightness(1.08);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
