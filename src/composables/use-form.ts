import { ref, computed } from 'vue'

export enum FORM_STATES {
  active = 'active',
  disabled = 'disabled',
  pending = 'pending',
  success = 'success',
}

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

  const setFormState = (state: FORM_STATES) => {
    formState.value = state
  }

  const disableForm = () => {
    setFormState(FORM_STATES.disabled)
  }

  const enableForm = () => {
    setFormState(FORM_STATES.active)
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
    setFormState(FORM_STATES.pending)
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
    setFormState,
    disableForm,
    enableForm,
    showConfirmation,
    hideConfirmation,
    hideConfirmationAfterSubmit,
  }
}
