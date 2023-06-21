import { FORM_STATES } from '@/enums'
import { ref, computed } from 'vue'

export function useForm() {
  const isConfirmationShown = ref(false)
  const formState = ref<FORM_STATES>(FORM_STATES.active)

  const isFormDisabled = computed(
    () => formState.value === FORM_STATES.disabled,
  )
  const isFormPending = computed(() => formState.value === FORM_STATES.pending)
  const isFormActive = computed(() => formState.value === FORM_STATES.active)
  const isFormSuccesfullySubmitted = computed(
    () => formState.value === FORM_STATES.success,
  )

  const disableForm = () => {
    formState.value = FORM_STATES.disabled
  }

  const enableForm = () => {
    formState.value = FORM_STATES.active
  }

  const showConfirmation = () => {
    disableForm()
    isConfirmationShown.value = true
  }

  const hideConfirmation = () => {
    enableForm()
    isConfirmationShown.value = false
  }

  const hideConfirmationAfterSubmit = async (submitFn: () => Promise<void>) => {
    formState.value = FORM_STATES.pending
    await submitFn()
    hideConfirmation()
  }

  return {
    isFormDisabled,
    isFormPending,
    isFormActive,
    isFormSuccesfullySubmitted,
    isConfirmationShown,
    formState,
    disableForm,
    enableForm,
    showConfirmation,
    hideConfirmation,
    hideConfirmationAfterSubmit,
  }
}
