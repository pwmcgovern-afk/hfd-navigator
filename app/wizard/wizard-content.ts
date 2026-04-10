// Bilingual content for all wizard steps — single source of truth
export const wizardContent = {
  en: {
    // Headers
    step: 'Step',
    of: 'of',
    continue: 'Continue',
    seeResults: 'See My Resources',
    skip: 'Skip this step',
    goBack: 'Go back to previous step',
    progressLabel: 'Wizard progress',

    // Location
    locationTitle: "What's your zip code?",
    locationSubtitle: "We'll show resources near you",
    locationWarning: "This zip code is outside Hartford. Some resources may not apply.",

    // Household
    householdTitle: 'How many people in your household?',
    householdSubtitle: 'Include yourself, spouse, and dependents',
    decreaseHousehold: 'Decrease household size',
    increaseHousehold: 'Increase household size',

    // Income
    incomeTitle: "What's your monthly household income?",
    incomeSubtitle: 'Before taxes, include all sources',
    perYear: '/year',

    // Housing
    housingTitle: "What's your housing situation?",
    housingSubtitle: 'This helps us find the right resources',
    housingOptions: [
      { value: 'housed', label: 'I have stable housing' },
      { value: 'at_risk', label: 'At risk of losing housing' },
      { value: 'homeless', label: 'Currently homeless or in shelter' },
    ],

    // Insurance
    insuranceTitle: 'What health insurance do you have?',
    insuranceSubtitle: 'Select your primary coverage',
    insuranceOptions: [
      { value: 'uninsured', label: 'No insurance' },
      { value: 'medicaid', label: 'Medicaid / HUSKY' },
      { value: 'medicare', label: 'Medicare' },
      { value: 'private', label: 'Private insurance' },
    ],

    // Situations
    situationsTitle: 'Do any of these apply to you?',
    situationsSubtitle: 'Select all that apply (optional)',
    situationOptions: [
      { value: 'veteran', label: 'Veteran' },
      { value: 'formerly_incarcerated', label: 'Recently released from incarceration' },
      { value: 'pregnant', label: 'Pregnant' },
      { value: 'children', label: 'Have children under 18' },
      { value: 'senior', label: 'Senior (60+)' },
      { value: 'disabled', label: 'Have a disability' },
      { value: 'domestic_violence', label: 'Experiencing domestic violence' },
    ],

    // Needs
    needsTitle: 'What kind of help do you need?',
    needsSubtitle: 'Select all that apply',
    needsOptions: [
      { slug: 'housing', name: 'Housing', icon: '🏠' },
      { slug: 'food', name: 'Food', icon: '🍎' },
      { slug: 'cash', name: 'Cash', icon: '💵' },
      { slug: 'harm-reduction', name: 'Harm Reduction', icon: '💊' },
      { slug: 'healthcare', name: 'Healthcare', icon: '🏥' },
      { slug: 'mental-health', name: 'Mental Health', icon: '🧠' },
      { slug: 'employment', name: 'Jobs', icon: '💼' },
      { slug: 'childcare', name: 'Childcare', icon: '👶' },
      { slug: 'legal', name: 'Legal Aid', icon: '⚖️' },
      { slug: 'transportation', name: 'Transportation', icon: '🚌' },
      { slug: 'utilities', name: 'Utilities', icon: '💡' },
      { slug: 'immigration', name: 'Immigration', icon: '📄' },
    ],
  },
  es: {
    step: 'Paso',
    of: 'de',
    continue: 'Continuar',
    seeResults: 'Ver Mis Recursos',
    skip: 'Saltar este paso',
    goBack: 'Volver al paso anterior',
    progressLabel: 'Progreso del asistente',

    locationTitle: '¿Cuál es su código postal?',
    locationSubtitle: 'Le mostraremos recursos cerca de usted',
    locationWarning: 'Este código postal está fuera de Hartford. Algunos recursos pueden no aplicar.',

    householdTitle: '¿Cuántas personas hay en su hogar?',
    householdSubtitle: 'Inclúyase a usted mismo, cónyuge y dependientes',
    decreaseHousehold: 'Disminuir tamaño del hogar',
    increaseHousehold: 'Aumentar tamaño del hogar',

    incomeTitle: '¿Cuál es el ingreso mensual de su hogar?',
    incomeSubtitle: 'Antes de impuestos, incluya todas las fuentes',
    perYear: '/año',

    housingTitle: '¿Cuál es su situación de vivienda?',
    housingSubtitle: 'Esto nos ayuda a encontrar los recursos correctos',
    housingOptions: [
      { value: 'housed', label: 'Tengo vivienda estable' },
      { value: 'at_risk', label: 'En riesgo de perder vivienda' },
      { value: 'homeless', label: 'Sin hogar o en refugio actualmente' },
    ],

    insuranceTitle: '¿Qué seguro médico tiene?',
    insuranceSubtitle: 'Seleccione su cobertura principal',
    insuranceOptions: [
      { value: 'uninsured', label: 'Sin seguro' },
      { value: 'medicaid', label: 'Medicaid / HUSKY' },
      { value: 'medicare', label: 'Medicare' },
      { value: 'private', label: 'Seguro privado' },
    ],

    situationsTitle: '¿Alguna de estas situaciones le aplica?',
    situationsSubtitle: 'Seleccione todas las que apliquen (opcional)',
    situationOptions: [
      { value: 'veteran', label: 'Veterano' },
      { value: 'formerly_incarcerated', label: 'Recientemente liberado de la cárcel' },
      { value: 'pregnant', label: 'Embarazada' },
      { value: 'children', label: 'Tiene hijos menores de 18 años' },
      { value: 'senior', label: 'Persona mayor (60+)' },
      { value: 'disabled', label: 'Tiene una discapacidad' },
      { value: 'domestic_violence', label: 'Experiencia de violencia doméstica' },
    ],

    needsTitle: '¿Qué tipo de ayuda necesita?',
    needsSubtitle: 'Seleccione todas las que apliquen',
    needsOptions: [
      { slug: 'housing', name: 'Vivienda', icon: '🏠' },
      { slug: 'food', name: 'Comida', icon: '🍎' },
      { slug: 'cash', name: 'Efectivo', icon: '💵' },
      { slug: 'harm-reduction', name: 'Reducción de Daños', icon: '💊' },
      { slug: 'healthcare', name: 'Salud', icon: '🏥' },
      { slug: 'mental-health', name: 'Salud Mental', icon: '🧠' },
      { slug: 'employment', name: 'Empleo', icon: '💼' },
      { slug: 'childcare', name: 'Cuidado Infantil', icon: '👶' },
      { slug: 'legal', name: 'Ayuda Legal', icon: '⚖️' },
      { slug: 'transportation', name: 'Transporte', icon: '🚌' },
      { slug: 'utilities', name: 'Servicios', icon: '💡' },
      { slug: 'immigration', name: 'Inmigración', icon: '📄' },
    ],
  }
}
