/**
 * Script to add organization-specific tips and Spanish translations
 * Using exact names from database
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const resourceUpdates: Record<string, {
  tips: string[]
  tipsEs: string[]
  descriptionEs: string
  howToApplyEs?: string
}> = {
  // ===== SHELTERS =====
  'Columbus House Emergency Shelter': {
    tips: [
      'Call the intake line before showing up - they can tell you about bed availability',
      'Bring your ID if you have one, but it\'s not required for emergency shelter',
      'Case managers can help with housing applications, job search, and benefits',
      'Ask about their rapid rehousing program if you\'re ready for your own place',
    ],
    tipsEs: [
      'Llame antes de llegar - le informarán sobre disponibilidad de camas',
      'Traiga su identificación si la tiene, pero no es obligatoria',
      'Los administradores de casos pueden ayudar con vivienda, empleo y beneficios',
      'Pregunte sobre el programa de realojamiento rápido',
    ],
    descriptionEs: 'El proveedor de servicios para personas sin hogar más grande de Connecticut. Refugio de emergencia, vivienda de transición, y apoyo permanente.',
    howToApplyEs: 'Llame a la línea de admisión o preséntese en el refugio.',
  },

  'Youth Continuum - Youth Shelter': {
    tips: [
      'Specifically for youth ages 14-21',
      'Safe space - staff are trained in trauma-informed care',
      'Can stay up to 90 days while working on a plan',
      'Education and job training support available',
    ],
    tipsEs: [
      'Específicamente para jóvenes de 14-21 años',
      'Espacio seguro - el personal está capacitado en cuidado informado por trauma',
      'Puede quedarse hasta 90 días mientras trabaja en un plan',
      'Apoyo educativo y de capacitación laboral disponible',
    ],
    descriptionEs: 'Refugio de emergencia para jóvenes de 14-21 años. Proporciona vivienda segura, administración de casos y servicios de apoyo.',
    howToApplyEs: 'Llame a la línea directa de jóvenes o preséntese.',
  },

  'Life Haven - Women & Children Shelter': {
    tips: [
      'Specifically for women and families with children',
      'Safe, secure location - address kept confidential',
      'Children can continue attending their current school',
      'Case management helps with housing search and benefits',
    ],
    tipsEs: [
      'Específicamente para mujeres y familias con niños',
      'Ubicación segura - dirección confidencial',
      'Los niños pueden continuar en su escuela actual',
      'La administración de casos ayuda con búsqueda de vivienda y beneficios',
    ],
    descriptionEs: 'Refugio de emergencia para mujeres y familias con niños. Proporciona vivienda segura y servicios de apoyo.',
    howToApplyEs: 'Llame para evaluación de admisión.',
  },

  // ===== HEALTHCARE =====
  'Cornell Scott-Hill Health Center - Primary Care': {
    tips: [
      'Sliding scale fees mean you pay based on income - could be as low as $20',
      'Walk-ins accepted but appointments get seen faster',
      'Ask about their patient assistance program for prescriptions',
      'They have interpreters available for Spanish and other languages',
    ],
    tipsEs: [
      'Tarifas escalonadas según sus ingresos - puede ser tan bajo como $20',
      'Aceptan sin cita pero las citas se atienden más rápido',
      'Pregunte sobre el programa de asistencia para medicamentos',
      'Tienen intérpretes para español y otros idiomas',
    ],
    descriptionEs: 'Centro de salud comunitario que sirve a Hartford desde 1968. Ofrece atención primaria con tarifas escalonadas.',
    howToApplyEs: 'Llame para cita o preséntese para servicios sin cita.',
  },

  'HAVEN Free Clinic': {
    tips: [
      'Completely free - no insurance or ID required',
      'Run by Yale medical students supervised by doctors',
      'Good for people who can\'t afford any healthcare costs',
      'Limited hours - call ahead to confirm schedule',
    ],
    tipsEs: [
      'Completamente gratis - no se requiere seguro ni identificación',
      'Dirigido por estudiantes de medicina de Yale supervisados por doctores',
      'Bueno para personas que no pueden pagar costos de atención médica',
      'Horario limitado - llame para confirmar',
    ],
    descriptionEs: 'Clínica gratuita dirigida por estudiantes de medicina de Yale. Proporciona atención primaria para pacientes sin seguro.',
    howToApplyEs: 'Preséntese durante las horas de la clínica. No se necesita cita.',
  },

  // ===== HARM REDUCTION =====
  'APT Foundation - Syringe Services': {
    tips: [
      'Completely confidential - no names or ID required',
      'Free Narcan (naloxone) and training on how to use it',
      'Wound care supplies and fentanyl test strips available',
      'Staff can connect you to treatment when you\'re ready - no pressure',
    ],
    tipsEs: [
      'Completamente confidencial - no se requiere nombre ni identificación',
      'Narcan gratis y capacitación sobre cómo usarlo',
      'Suministros para cuidado de heridas y tiras de prueba de fentanilo',
      'El personal puede conectarlo con tratamiento cuando esté listo',
    ],
    descriptionEs: 'Programa de reducción de daños. Proporciona jeringas estériles, Narcan, y conexión a servicios de tratamiento.',
    howToApplyEs: 'Preséntese durante las horas de operación. No se requiere cita ni identificación.',
  },

  'Cornell Scott-Hill Health Center - MAT Program': {
    tips: [
      'Medication-assisted treatment with Suboxone available',
      'Same-day starts often possible - call early morning',
      'Integrated with primary care - treats the whole person',
      'Counseling included with MAT program',
    ],
    tipsEs: [
      'Tratamiento asistido con medicamentos con Suboxone disponible',
      'Inicio el mismo día a menudo posible - llame temprano',
      'Integrado con atención primaria - trata a la persona completa',
      'Consejería incluida con el programa MAT',
    ],
    descriptionEs: 'Tratamiento asistido con medicamentos para trastorno por uso de opioides. Incluye Suboxone, consejería y administración de casos.',
    howToApplyEs: 'Llame para cita de admisión.',
  },

  'Free Narcan Distribution': {
    tips: [
      'Narcan saves lives - get trained and carry it',
      'Available at pharmacies, libraries, and community centers',
      'Training takes just 10 minutes',
      'Get extra kits to give to friends and family',
    ],
    tipsEs: [
      'El Narcan salva vidas - capacítese y llévelo consigo',
      'Disponible en farmacias, bibliotecas y centros comunitarios',
      'La capacitación toma solo 10 minutos',
      'Obtenga kits extra para dar a amigos y familiares',
    ],
    descriptionEs: 'Distribución gratuita de Narcan (naloxona) para revertir sobredosis de opioides. Capacitación incluida.',
    howToApplyEs: 'Visite una ubicación de distribución. No se necesita cita.',
  },

  // ===== EMPLOYMENT =====
  'Career Resources Inc': {
    tips: [
      'Free resume help and interview coaching available',
      'Computer lab for job searching - staff can help you apply online',
      'Ask about their job training programs - some pay you while training',
      'Business attire available for interviews through partner programs',
    ],
    tipsEs: [
      'Ayuda gratuita con currículum y preparación para entrevistas',
      'Laboratorio de computadoras para buscar trabajo',
      'Pregunte sobre programas de capacitación - algunos pagan mientras se capacita',
      'Ropa profesional disponible para entrevistas',
    ],
    descriptionEs: 'Centro de empleo que ofrece capacitación laboral, colocación y servicios de carrera.',
    howToApplyEs: 'Visite durante el horario de atención para registrarse.',
  },

  'Project MORE Reentry Employment': {
    tips: [
      'Specifically helps people with criminal records find work',
      'Will advocate with employers on your behalf',
      'Know about companies that hire formerly incarcerated people',
      'Can help with getting IDs, birth certificates, and other documents',
    ],
    tipsEs: [
      'Ayuda específicamente a personas con antecedentes penales',
      'Abogará con los empleadores en su nombre',
      'Conocen empresas que contratan personas anteriormente encarceladas',
      'Pueden ayudar a obtener identificaciones y certificados de nacimiento',
    ],
    descriptionEs: 'Asiste a personas que regresan de la encarcelación con empleo, vivienda y servicios de reintegración.',
    howToApplyEs: 'Llame o visite para una cita de admisión.',
  },

  'EMERGE CT - Reentry Employment': {
    tips: [
      'Specifically for people with criminal records',
      'Paid job training programs available',
      'Help with resume, interview skills, and job placement',
      'Supportive staff who understand the challenges of reentry',
    ],
    tipsEs: [
      'Específicamente para personas con antecedentes penales',
      'Programas de capacitación laboral pagados disponibles',
      'Ayuda con currículum, habilidades de entrevista y colocación laboral',
      'Personal de apoyo que entiende los desafíos de la reintegración',
    ],
    descriptionEs: 'Servicios de empleo para personas con antecedentes penales. Capacitación laboral, colocación y apoyo continuo.',
    howToApplyEs: 'Llame para una cita de admisión.',
  },

  // ===== LEGAL =====
  'Hartford Legal Assistance Association': {
    tips: [
      'Free legal help for low-income Hartford residents',
      'If facing eviction, call immediately - they may be able to represent you in court',
      'Can help with public benefits appeals (SNAP, TANF, disability denials)',
      'Immigration help available through separate immigration unit',
    ],
    tipsEs: [
      'Ayuda legal gratuita para residentes de bajos ingresos',
      'Si enfrenta desalojo, llame inmediatamente',
      'Pueden ayudar con apelaciones de beneficios públicos',
      'Ayuda de inmigración disponible',
    ],
    descriptionEs: 'Servicios legales civiles gratuitos. Especializado en vivienda, beneficios públicos, familia e inmigración.',
    howToApplyEs: 'Llame a la línea de admisión para evaluación de elegibilidad.',
  },

  'Eviction Defense - Greater Hartford': {
    tips: [
      'If you got an eviction notice, don\'t wait - call right away',
      'Even if you owe rent, you may have defenses',
      'Never ignore court papers - it makes things worse',
      'They can sometimes negotiate with landlords to avoid court',
    ],
    tipsEs: [
      'Si recibió un aviso de desalojo, no espere - llame de inmediato',
      'Incluso si debe alquiler, puede tener defensas',
      'Nunca ignore los documentos de la corte - empeora las cosas',
      'A veces pueden negociar con los propietarios para evitar la corte',
    ],
    descriptionEs: 'Defensa legal gratuita para inquilinos que enfrentan desalojo. Representación en corte de vivienda.',
    howToApplyEs: 'Llame a la línea directa de desalojo inmediatamente después de recibir documentos de la corte.',
  },

  'Clean Slate CT - Record Expungement': {
    tips: [
      'Many old convictions can now be erased from your record',
      'Some records are automatically cleared - check if yours qualifies',
      'Clean record opens up housing and job opportunities',
      'Process is free - don\'t pay anyone to do this',
    ],
    tipsEs: [
      'Muchas condenas antiguas ahora pueden borrarse de su registro',
      'Algunos registros se borran automáticamente - verifique si califica',
      'Un registro limpio abre oportunidades de vivienda y empleo',
      'El proceso es gratis - no pague a nadie por esto',
    ],
    descriptionEs: 'Ayuda con borrar antecedentes penales elegibles bajo las nuevas leyes de Connecticut.',
    howToApplyEs: 'Llame o visite el sitio web para verificar elegibilidad.',
  },

  // ===== HOUSING =====
  'Hartford Housing Authority (Elm City Communities)': {
    tips: [
      'Section 8 waitlist is often long - apply and keep your info updated',
      'Public housing may have shorter waits than Section 8 vouchers',
      'Emergency transfers possible for domestic violence situations',
      'Keep copies of all paperwork you submit',
    ],
    tipsEs: [
      'La lista de espera de la Sección 8 es larga - solicite y mantenga su información actualizada',
      'La vivienda pública puede tener esperas más cortas que los vales de la Sección 8',
      'Transferencias de emergencia posibles para violencia doméstica',
      'Guarde copias de todos los documentos que presente',
    ],
    descriptionEs: 'Autoridad de vivienda de Hartford. Administra vivienda pública y vales de la Sección 8.',
    howToApplyEs: 'Presente la solicitud en línea o en persona.',
  },

  'Liberty Community Services - Rapid Rehousing': {
    tips: [
      'Helps you move quickly from homelessness to your own apartment',
      'Provides short-term rental assistance while you stabilize',
      'Case management helps with budgeting and keeping housing',
      'Must be experiencing homelessness to qualify',
    ],
    tipsEs: [
      'Ayuda a mudarse rápidamente de la falta de vivienda a su propio apartamento',
      'Proporciona asistencia de alquiler a corto plazo mientras se estabiliza',
      'La administración de casos ayuda con presupuesto y mantener vivienda',
      'Debe estar sin hogar para calificar',
    ],
    descriptionEs: 'Programa de realojamiento rápido que ayuda a personas sin hogar a obtener y mantener vivienda permanente.',
    howToApplyEs: 'Contacte a través del sistema de entrada coordinada o llame directamente.',
  },

  // ===== UTILITIES =====
  'LIHEAP - Heating Assistance': {
    tips: [
      'Apply in fall before heating season starts - funds run out',
      'Can help with past-due bills, not just current ones',
      'Income limits are higher than you might think - apply anyway',
      'Bring recent utility bills and proof of income to your appointment',
    ],
    tipsEs: [
      'Solicite en otoño antes de la temporada de calefacción - los fondos se agotan',
      'Pueden ayudar con facturas atrasadas, no solo las actuales',
      'Los límites de ingresos son más altos de lo que piensa - solicite de todos modos',
      'Traiga facturas recientes y comprobante de ingresos',
    ],
    descriptionEs: 'Programa federal de asistencia de calefacción para hogares de bajos ingresos.',
    howToApplyEs: 'Llame a la agencia de acción comunitaria para una cita.',
  },

  'Operation Fuel': {
    tips: [
      'Helps when LIHEAP funds run out or you don\'t qualify',
      'Can help with any type of heat - oil, gas, electric',
      'One-time emergency grants available',
      'Apply through local community action agency',
    ],
    tipsEs: [
      'Ayuda cuando los fondos de LIHEAP se agotan o no califica',
      'Puede ayudar con cualquier tipo de calefacción',
      'Subvenciones de emergencia únicas disponibles',
      'Solicite a través de la agencia de acción comunitaria local',
    ],
    descriptionEs: 'Asistencia de emergencia para calefacción cuando otros programas no están disponibles.',
    howToApplyEs: 'Contacte a la agencia de acción comunitaria local.',
  },

  // ===== CHILDCARE =====
  'Care 4 Kids Childcare Subsidy': {
    tips: [
      'Connecticut\'s childcare subsidy program - helps pay for childcare',
      'Can use with any licensed provider, including family childcare',
      'Income limits are higher for larger families',
      'Apply online or by phone - process takes 2-4 weeks',
    ],
    tipsEs: [
      'Programa de subsidio de cuidado infantil de Connecticut',
      'Puede usarse con cualquier proveedor licenciado',
      'Los límites de ingresos son más altos para familias más grandes',
      'Solicite en línea o por teléfono - el proceso toma 2-4 semanas',
    ],
    descriptionEs: 'Subsidio estatal que ayuda a familias de bajos ingresos a pagar el cuidado infantil.',
    howToApplyEs: 'Solicite en línea en ctcare4kids.com o llame.',
  },

  'Hartford Head Start': {
    tips: [
      'Completely free preschool for income-eligible families',
      'Full-day program helps working parents',
      'Includes meals, health screenings, and family support services',
      'Apply early - spots fill up',
    ],
    tipsEs: [
      'Preescolar completamente gratis para familias elegibles por ingresos',
      'Programa de día completo ayuda a padres que trabajan',
      'Incluye comidas, exámenes de salud y servicios de apoyo familiar',
      'Solicite temprano - los lugares se llenan',
    ],
    descriptionEs: 'Programa preescolar gratuito para niños de 3-5 años de familias de bajos ingresos.',
    howToApplyEs: 'Llame o visite para solicitar. Traiga comprobante de ingresos e identificación del niño.',
  },

  'All Our Kin Family Childcare': {
    tips: [
      'Connects families with licensed family childcare providers',
      'Providers are vetted and trained - safe for your kids',
      'Many providers accept Care4Kids subsidies',
      'Spanish-speaking providers available',
    ],
    tipsEs: [
      'Conecta familias con proveedores de cuidado infantil familiar licenciados',
      'Los proveedores son examinados y capacitados',
      'Muchos proveedores aceptan subsidios de Care4Kids',
      'Proveedores hispanohablantes disponibles',
    ],
    descriptionEs: 'Red de proveedores de cuidado infantil familiar licenciados.',
    howToApplyEs: 'Llame o visite el sitio web para encontrar un proveedor.',
  },

  // ===== VETERANS =====
  'VA Connecticut Healthcare': {
    tips: [
      'Any veteran can enroll - even if you don\'t think you qualify',
      'Emergency room open 24/7 for veterans in crisis',
      'Ask about the HCHV program if you\'re homeless',
      'Benefits counselors can help you understand all your VA benefits',
    ],
    tipsEs: [
      'Cualquier veterano puede inscribirse - incluso si cree que no califica',
      'Sala de emergencias abierta 24/7 para veteranos en crisis',
      'Pregunte sobre el programa HCHV si no tiene hogar',
      'Los consejeros de beneficios pueden ayudarlo a entender sus beneficios',
    ],
    descriptionEs: 'Centro médico del VA que proporciona atención médica integral para veteranos.',
    howToApplyEs: 'Llame o visite la oficina de inscripción. Traiga su DD-214 si lo tiene.',
  },

  // ===== BENEFITS =====
  '211 Connecticut': {
    tips: [
      'Available 24/7 - call anytime, even at night',
      'Operators can search for resources you might not know exist',
      'Can help in multiple languages',
      'Text your zip code to 898211 for quick resource links',
    ],
    tipsEs: [
      'Disponible 24/7 - llame en cualquier momento',
      'Los operadores pueden buscar recursos que quizás no sepa que existen',
      'Pueden ayudar en múltiples idiomas',
      'Envíe mensaje de texto con su código postal al 898211',
    ],
    descriptionEs: 'Línea de información y referencia 24/7 que conecta a las personas con servicios de salud y humanos.',
    howToApplyEs: 'Llame al 211 o visite 211ct.org. Disponible 24/7.',
  },

  'SNAP/Food Stamps Enrollment': {
    tips: [
      'Apply online at connect.ct.gov to avoid long waits at DSS office',
      'Ask about expedited SNAP if you have less than $100 and very low income',
      'Benefits can be used at most grocery stores and farmers markets',
      'If denied, you have the right to appeal',
    ],
    tipsEs: [
      'Solicite en línea en connect.ct.gov para evitar largas esperas',
      'Pregunte sobre SNAP acelerado si tiene menos de $100',
      'Los beneficios se pueden usar en la mayoría de las tiendas y mercados de agricultores',
      'Si le niegan, tiene derecho a apelar',
    ],
    descriptionEs: 'Programa de asistencia nutricional que proporciona beneficios mensuales para comprar alimentos.',
    howToApplyEs: 'Solicite en línea en connect.ct.gov, por teléfono o en persona en DSS.',
  },

  'TANF Cash Assistance': {
    tips: [
      'Cash assistance for families with children',
      'Must participate in work activities unless exempt',
      'Can help while you\'re looking for work or in job training',
      'Emergency assistance available for one-time needs',
    ],
    tipsEs: [
      'Asistencia en efectivo para familias con niños',
      'Debe participar en actividades laborales a menos que esté exento',
      'Puede ayudar mientras busca trabajo o está en capacitación',
      'Asistencia de emergencia disponible para necesidades únicas',
    ],
    descriptionEs: 'Programa de asistencia en efectivo para familias de bajos ingresos con niños.',
    howToApplyEs: 'Solicite en línea en connect.ct.gov o en persona en DSS.',
  },

  'HUSKY Health (Medicaid) Enrollment': {
    tips: [
      'Free health insurance for low-income adults and children',
      'Income limits are higher than you might think - worth applying',
      'Covers doctor visits, prescriptions, mental health, and dental',
      'Can apply anytime - no enrollment period',
    ],
    tipsEs: [
      'Seguro de salud gratis para adultos y niños de bajos ingresos',
      'Los límites de ingresos son más altos de lo que piensa - vale la pena solicitar',
      'Cubre visitas al médico, medicamentos, salud mental y dental',
      'Puede solicitar en cualquier momento - sin período de inscripción',
    ],
    descriptionEs: 'El programa Medicaid de Connecticut. Proporciona seguro de salud gratuito o de bajo costo.',
    howToApplyEs: 'Solicite en línea en accesshealthct.com o connect.ct.gov.',
  },

  // ===== FOOD =====
  'Community Soup Kitchen of Hartford': {
    tips: [
      'No questions asked - just come in and eat',
      'Hot, nutritious meals served daily',
      'Welcoming environment - staff treats everyone with respect',
      'Can connect you with other services if needed',
    ],
    tipsEs: [
      'Sin preguntas - solo entre y coma',
      'Comidas calientes y nutritivas servidas diariamente',
      'Ambiente acogedor - el personal trata a todos con respeto',
      'Pueden conectarlo con otros servicios si es necesario',
    ],
    descriptionEs: 'Cocina comunitaria que sirve comidas calientes gratuitas a cualquier persona que lo necesite.',
    howToApplyEs: 'Preséntese durante el horario de comidas. No se necesita cita.',
  },

  'Christian Community Action Food Pantry': {
    tips: [
      'Their NEW HOPE program provides furnished apartments for up to 3 years',
      'Food pantry is separate from housing - you can use one or both',
      'Case managers really invest in helping you succeed',
      'Faith-based but serves everyone regardless of religion',
    ],
    tipsEs: [
      'Su programa NEW HOPE proporciona apartamentos amueblados por hasta 3 años',
      'La despensa es separada de la vivienda - puede usar uno o ambos',
      'Los administradores de casos realmente invierten en ayudarlo',
      'Basado en la fe pero sirve a todos sin importar la religión',
    ],
    descriptionEs: 'Despensa de alimentos y servicios de vivienda operados por organización basada en la fe.',
    howToApplyEs: 'Llame o visite para admisión.',
  },

  'Salvation Army Hartford Food Pantry': {
    tips: [
      'Food pantry open multiple days per week',
      'Can also help with utility bills and other emergency needs',
      'Seasonal programs for holidays',
      'No religious requirements to receive help',
    ],
    tipsEs: [
      'Despensa de alimentos abierta varios días por semana',
      'También pueden ayudar con facturas de servicios y otras necesidades de emergencia',
      'Programas estacionales para días festivos',
      'Sin requisitos religiosos para recibir ayuda',
    ],
    descriptionEs: 'Despensa de alimentos y servicios de asistencia de emergencia.',
    howToApplyEs: 'Preséntese durante las horas de distribución. Traiga identificación si la tiene.',
  },

  // ===== IMMIGRATION =====
  'Connecticut Institute for Refugees and Immigrants': {
    tips: [
      'Serves refugees, asylees, and other immigrants',
      'Legal services for asylum applications and green card renewals',
      'Job placement program specifically for immigrants',
      'ESL classes and cultural orientation available',
    ],
    tipsEs: [
      'Sirve a refugiados, asilados y otros inmigrantes',
      'Servicios legales para solicitudes de asilo y renovaciones de green card',
      'Programa de colocación laboral para inmigrantes',
      'Clases de inglés y orientación cultural disponibles',
    ],
    descriptionEs: 'Agencia de reasentamiento que proporciona servicios completos para refugiados e inmigrantes.',
    howToApplyEs: 'Llame o visite para una cita de admisión.',
  },

  'Yale Law School - Immigrant Rights Clinic': {
    tips: [
      'Free legal help from law students supervised by attorneys',
      'Can help with asylum, deportation defense, and other immigration cases',
      'Takes on complex cases that other providers might not',
      'Very thorough - cases get a lot of attention',
    ],
    tipsEs: [
      'Ayuda legal gratuita de estudiantes de derecho supervisados por abogados',
      'Pueden ayudar con asilo, defensa contra deportación y otros casos',
      'Toman casos complejos que otros proveedores podrían no tomar',
      'Muy completo - los casos reciben mucha atención',
    ],
    descriptionEs: 'Clínica de derechos de inmigrantes que proporciona representación legal gratuita.',
    howToApplyEs: 'Llame o envíe un correo electrónico para consulta.',
  },

  // ===== MENTAL HEALTH =====
  '988 Suicide & Crisis Lifeline': {
    tips: [
      'Available 24/7 - someone is always there to listen',
      'You don\'t have to be suicidal to call - any mental health crisis counts',
      'Can also text if you\'re not comfortable talking',
      'Trained counselors, not automated systems',
    ],
    tipsEs: [
      'Disponible 24/7 - siempre hay alguien para escuchar',
      'No tiene que ser suicida para llamar - cualquier crisis de salud mental cuenta',
      'También puede enviar mensaje de texto si no se siente cómodo hablando',
      'Consejeros capacitados, no sistemas automatizados',
    ],
    descriptionEs: 'Línea de ayuda de crisis disponible 24/7 para cualquier persona en crisis emocional o angustia.',
    howToApplyEs: 'Llame o envíe mensaje de texto al 988. Disponible 24/7.',
  },

  'Mobile Crisis Team': {
    tips: [
      'They come to you - wherever you are',
      'Alternative to calling 911 for mental health crisis',
      'Can help de-escalate situations without police involvement',
      'Connected to ongoing mental health services',
    ],
    tipsEs: [
      'Vienen a usted - donde sea que esté',
      'Alternativa a llamar al 911 para crisis de salud mental',
      'Pueden ayudar a desescalar situaciones sin participación policial',
      'Conectados a servicios continuos de salud mental',
    ],
    descriptionEs: 'Equipo móvil de crisis que responde a emergencias de salud mental en la comunidad.',
    howToApplyEs: 'Llame al 211 y pida el equipo móvil de crisis.',
  },

  'BHcare Counseling': {
    tips: [
      'Walk-in hours available - no appointment needed for first visit',
      'Accepts most insurance including Medicaid',
      'Can see a counselor within a week of first call',
      'Groups and individual therapy available',
    ],
    tipsEs: [
      'Horario sin cita disponible - no se necesita cita para la primera visita',
      'Acepta la mayoría de los seguros incluyendo Medicaid',
      'Puede ver a un consejero dentro de una semana de la primera llamada',
      'Terapia grupal e individual disponible',
    ],
    descriptionEs: 'Servicios de consejería de salud mental y abuso de sustancias para todas las edades.',
    howToApplyEs: 'Llame para cita o preséntese durante horario sin cita.',
  },

  'The Connection - Mental Health Services': {
    tips: [
      'Specializes in serious mental illness and co-occurring disorders',
      'Peer support specialists - people with lived experience',
      'Assertive Community Treatment (ACT) team for intensive support',
      'Accepts referrals from hospitals, courts, and self-referrals',
    ],
    tipsEs: [
      'Especializado en enfermedades mentales graves y trastornos concurrentes',
      'Especialistas de apoyo entre pares - personas con experiencia vivida',
      'Equipo de tratamiento comunitario asertivo (ACT) para apoyo intensivo',
      'Acepta referencias de hospitales, tribunales y auto-referencias',
    ],
    descriptionEs: 'Servicios de salud mental para adultos con enfermedades mentales graves.',
    howToApplyEs: 'Llame para admisión o solicite referencia de su proveedor de salud.',
  },

  // ===== DOMESTIC VIOLENCE =====
  'Domestic Violence Hotline - Safe Haven': {
    tips: [
      'Confidential - they won\'t share your information',
      'Can help you make a safety plan even if you\'re not ready to leave',
      'Emergency shelter available',
      'Services for all genders',
    ],
    tipsEs: [
      'Confidencial - no compartirán su información',
      'Pueden ayudarlo a hacer un plan de seguridad incluso si no está listo para irse',
      'Refugio de emergencia disponible',
      'Servicios para todos los géneros',
    ],
    descriptionEs: 'Línea directa y refugio para sobrevivientes de violencia doméstica.',
    howToApplyEs: 'Llame a la línea directa 24/7. La ubicación del refugio es confidencial.',
  },

  'Umbrella Center for Domestic Violence Services': {
    tips: [
      'Full range of services - legal advocacy, counseling, shelter',
      'Can help you get a restraining order',
      'Support groups for survivors',
      'Children\'s services available',
    ],
    tipsEs: [
      'Gama completa de servicios - abogacía legal, consejería, refugio',
      'Pueden ayudarlo a obtener una orden de restricción',
      'Grupos de apoyo para sobrevivientes',
      'Servicios para niños disponibles',
    ],
    descriptionEs: 'Servicios integrales para sobrevivientes de violencia doméstica incluyendo refugio, consejería y ayuda legal.',
    howToApplyEs: 'Llame a la línea directa. Servicios confidenciales.',
  },

  // ===== TRANSPORTATION =====
  'CT Transit - Reduced Fare': {
    tips: [
      'Seniors 65+ and people with disabilities get half-price fares',
      'Medicare cardholders automatically qualify',
      'Apply at CT Transit office with ID and proof of eligibility',
      'Monthly passes available for even more savings',
    ],
    tipsEs: [
      'Personas mayores de 65+ y personas con discapacidades obtienen tarifas a mitad de precio',
      'Los titulares de Medicare califican automáticamente',
      'Solicite en la oficina de CT Transit con identificación y prueba de elegibilidad',
      'Pases mensuales disponibles para aún más ahorros',
    ],
    descriptionEs: 'Programa de tarifa reducida de autobús para personas mayores y personas con discapacidades.',
    howToApplyEs: 'Visite la oficina de CT Transit con identificación y prueba de elegibilidad.',
  },

  'Medical Rides - VEYO': {
    tips: [
      'Free rides to medical appointments for Medicaid members',
      'Must schedule at least 2 days in advance',
      'Can bring one companion for support',
      'Save your confirmation number',
    ],
    tipsEs: [
      'Viajes gratis a citas médicas para miembros de Medicaid',
      'Debe programar al menos 2 días de anticipación',
      'Puede traer un acompañante para apoyo',
      'Guarde su número de confirmación',
    ],
    descriptionEs: 'Transporte médico gratuito para miembros de Medicaid a citas médicas.',
    howToApplyEs: 'Llame a VEYO para programar un viaje. Tenga su número de Medicaid listo.',
  },

  // ===== ID =====
  'Hartford Elm City ID': {
    tips: [
      'Available to all Hartford residents regardless of immigration status',
      'Accepted as ID at city services, some banks, and some businesses',
      'Includes debit card functionality',
      'Costs only $5 - free for seniors and people experiencing homelessness',
    ],
    tipsEs: [
      'Disponible para todos los residentes de Hartford sin importar el estatus migratorio',
      'Aceptada como identificación en servicios de la ciudad, algunos bancos y negocios',
      'Incluye funcionalidad de tarjeta de débito',
      'Cuesta solo $5 - gratis para personas mayores y personas sin hogar',
    ],
    descriptionEs: 'Tarjeta de identificación municipal disponible para todos los residentes de Hartford.',
    howToApplyEs: 'Visite la oficina de Elm City ID con prueba de residencia e identidad.',
  },
}

async function main() {
  console.log('Adding organization-specific tips and Spanish translations (v2)...\n')

  let updated = 0
  let notFound = 0

  for (const [name, data] of Object.entries(resourceUpdates)) {
    const resource = await prisma.resource.findFirst({
      where: { name }
    })

    if (resource) {
      await prisma.resource.update({
        where: { id: resource.id },
        data: {
          tips: data.tips,
          tipsEs: data.tipsEs,
          descriptionEs: data.descriptionEs,
          howToApplyEs: data.howToApplyEs || null,
        }
      })
      console.log(`Updated: ${name}`)
      updated++
    } else {
      console.log(`Not found: ${name}`)
      notFound++
    }
  }

  console.log(`\n=== Complete ===`)
  console.log(`Updated: ${updated}`)
  console.log(`Not found: ${notFound}`)
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
