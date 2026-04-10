/**
 * Script to add organization-specific tips and Spanish translations
 * to existing resources in the database.
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Organization-specific tips and Spanish translations
const resourceUpdates: Record<string, {
  tips: string[]
  tipsEs: string[]
  descriptionEs: string
  howToApplyEs?: string
  nameEs?: string
}> = {
  // ===== FOOD PANTRIES =====
  'Downtown Evening Soup Kitchen (DESK)': {
    tips: [
      'No ID or proof of need required - just show up during meal times',
      'Hot meals served cafeteria style - come hungry',
      'Staff can connect you to other services like housing assistance',
      'Vegetarian options usually available - ask the servers',
    ],
    tipsEs: [
      'No se requiere identificación - solo preséntese durante las comidas',
      'Comidas calientes servidas estilo cafetería',
      'El personal puede conectarlo con otros servicios como asistencia de vivienda',
      'Opciones vegetarianas disponibles - pregunte a los servidores',
    ],
    descriptionEs: 'Comidas calientes gratuitas para cualquier persona que lo necesite. Sin preguntas. Cena de lunes a viernes 4:30-5:30pm, almuerzo sábados 11am-12pm.',
    howToApplyEs: 'Simplemente preséntese durante el horario de comidas. No se requiere cita.',
  },

  'Connecticut Food Bank - Hartford': {
    tips: [
      'Large quantities available - bring bags or a cart if you have one',
      'Distribution dates vary by month - check their website or call ahead',
      'Some sites require pre-registration, others are first-come-first-served',
      'Ask about SNAP enrollment assistance while you\'re there',
    ],
    tipsEs: [
      'Grandes cantidades disponibles - traiga bolsas o un carrito',
      'Las fechas de distribución varían - consulte su sitio web o llame',
      'Algunos sitios requieren registro previo',
      'Pregunte sobre asistencia para inscripción en SNAP',
    ],
    descriptionEs: 'El banco de alimentos más grande de Connecticut. Distribuye millones de libras de comida anualmente a través de una red de despensas locales.',
    howToApplyEs: 'Visite el sitio web para encontrar la despensa más cercana. Use el localizador de despensas para horarios.',
  },

  'Loaves and Fishes - St. Paul & St. James Church': {
    tips: [
      'One of Hartford\'s longest-running food ministries - trusted for over 40 years',
      'Clothing closet has winter coats, professional attire, and children\'s clothes',
      'Personal care items (soap, toothpaste, diapers) often available',
      'Welcoming to all faiths and backgrounds',
    ],
    tipsEs: [
      'Uno de los ministerios de alimentos más antiguos de Hartford - más de 40 años',
      'El ropero tiene abrigos, ropa profesional y ropa para niños',
      'Artículos de cuidado personal frecuentemente disponibles',
      'Bienvenidos todas las religiones y orígenes',
    ],
    descriptionEs: 'Despensa de alimentos y ropero del ministerio desde 1982. Proporciona comida, ropa y artículos de cuidado personal.',
    howToApplyEs: 'Preséntese durante las horas de distribución.',
  },

  'Chapel on the Green': {
    tips: [
      'Outdoor service happens rain or shine - dress for the weather',
      'Free meal served after worship - all are welcome to eat',
      'Great place to meet others and find community support',
      'Staff and volunteers can help connect you to other resources',
    ],
    tipsEs: [
      'El servicio al aire libre ocurre llueva o haga sol - vístase apropiadamente',
      'Comida gratis después del culto - todos son bienvenidos',
      'Buen lugar para conocer a otros y encontrar apoyo comunitario',
      'El personal puede ayudarlo a conectarse con otros recursos',
    ],
    descriptionEs: 'Servicio de adoración al aire libre y comida gratis para personas sin hogar y vulnerables. Incluye círculo de tambores, Eucaristía y comunidad.',
    howToApplyEs: 'Preséntese. Todos son bienvenidos.',
  },

  // ===== SHELTERS =====
  'Columbus House': {
    tips: [
      'Call the intake line before showing up - they can tell you about bed availability',
      'Bring your ID if you have one, but it\'s not required for emergency shelter',
      'Case managers can help with housing applications, job search, and benefits',
      'Ask about their rapid rehousing program if you\'re ready for your own place',
    ],
    tipsEs: [
      'Llame a la línea de admisión antes de llegar - le informarán sobre disponibilidad',
      'Traiga su identificación si la tiene, pero no es obligatoria',
      'Los administradores de casos pueden ayudar con vivienda, empleo y beneficios',
      'Pregunte sobre el programa de realojamiento rápido',
    ],
    descriptionEs: 'El proveedor de servicios para personas sin hogar más grande de Connecticut. Refugio de emergencia, vivienda de transición, y apoyo permanente.',
    howToApplyEs: 'Llame a la línea de admisión o preséntese en el refugio. Evaluación de entrada coordinada disponible.',
  },

  'Hartford Home Recovery - Abraham\'s Tent': {
    tips: [
      'Specifically for men experiencing homelessness - women should contact Columbus House',
      'Faith-based but welcoming to all - no religious requirements',
      'Meals and case management included with shelter stay',
      'Good stepping stone to longer-term housing programs',
    ],
    tipsEs: [
      'Específicamente para hombres sin hogar - las mujeres deben contactar Columbus House',
      'Basado en la fe pero abierto a todos - sin requisitos religiosos',
      'Comidas y administración de casos incluidos',
      'Buen paso hacia programas de vivienda a largo plazo',
    ],
    descriptionEs: 'Refugio de emergencia para hombres sin hogar operado por la comunidad religiosa. Incluye comidas, administración de casos y conexión a recursos.',
    howToApplyEs: 'Llame o preséntese. Los servicios se proporcionan según el orden de llegada.',
  },

  // ===== HEALTHCARE =====
  'Cornell Scott-Hill Health Center - Congress Avenue': {
    tips: [
      'Sliding scale fees mean you pay based on income - could be as low as $20',
      'Walk-ins accepted but appointments get seen faster',
      'Ask about their patient assistance program for prescriptions',
      'They have interpreters available for Spanish and other languages',
    ],
    tipsEs: [
      'Las tarifas escalonadas significan que paga según sus ingresos - puede ser tan bajo como $20',
      'Aceptan sin cita pero las citas se atienden más rápido',
      'Pregunte sobre el programa de asistencia para medicamentos',
      'Tienen intérpretes disponibles para español y otros idiomas',
    ],
    descriptionEs: 'Centro de salud comunitario que sirve a la comunidad de Hartford desde 1968. Ofrece atención primaria, dental, salud mental y más.',
    howToApplyEs: 'Llame para hacer una cita o preséntese para servicios sin cita. Traiga identificación y comprobante de ingresos si es posible.',
  },

  'Fair Haven Community Health Care': {
    tips: [
      'Strong Spanish-speaking staff - comfortable for Latino families',
      'Dental services available at this location',
      'WIC office on site for pregnant women and young children',
      'Can help with Medicaid/HUSKY enrollment',
    ],
    tipsEs: [
      'Personal hispanohablante - cómodo para familias latinas',
      'Servicios dentales disponibles en esta ubicación',
      'Oficina de WIC en el lugar para mujeres embarazadas y niños pequeños',
      'Pueden ayudar con la inscripción en Medicaid/HUSKY',
    ],
    descriptionEs: 'Centro de salud comunitario que sirve a Fair Haven y alrededores. Atención primaria, dental, y servicios prenatales.',
    howToApplyEs: 'Llame para una cita. Aceptan la mayoría de seguros y ofrecen tarifas escalonadas.',
  },

  // ===== MENTAL HEALTH =====
  'Connecticut Mental Health Center': {
    tips: [
      'State-funded facility - no one turned away for inability to pay',
      'If you\'re in crisis, go to the emergency room - open 24/7',
      'Ask about their peer support specialists - people with lived experience',
      'Long-term treatment programs available for serious mental illness',
    ],
    tipsEs: [
      'Instalación financiada por el estado - nadie es rechazado por no poder pagar',
      'Si está en crisis, vaya a la sala de emergencias - abierta 24/7',
      'Pregunte sobre los especialistas de apoyo entre pares',
      'Programas de tratamiento a largo plazo disponibles',
    ],
    descriptionEs: 'El centro de salud mental más grande de Connecticut, afiliado a Yale. Atención psiquiátrica integral, incluyendo servicios de emergencia.',
    howToApplyEs: 'Llame para una cita de admisión. Para emergencias, vaya directamente a la sala de emergencias.',
  },

  // ===== HARM REDUCTION =====
  'Hartford Syringe Services Program': {
    tips: [
      'Completely confidential - no names or ID required',
      'Free Narcan (naloxone) and training on how to use it',
      'Wound care supplies and fentanyl test strips available',
      'Staff can connect you to treatment when you\'re ready - no pressure',
    ],
    tipsEs: [
      'Completamente confidencial - no se requiere nombre ni identificación',
      'Narcan (naloxona) gratis y capacitación sobre cómo usarlo',
      'Suministros para el cuidado de heridas y tiras de prueba de fentanilo disponibles',
      'El personal puede conectarlo con tratamiento cuando esté listo - sin presión',
    ],
    descriptionEs: 'Programa de reducción de daños que proporciona jeringas estériles, Narcan, y conexión a servicios de tratamiento.',
    howToApplyEs: 'Preséntese durante las horas de operación. No se requiere cita ni identificación.',
  },

  'APT Foundation - Orchard Street': {
    tips: [
      'Same-day intake often available - call early in the morning',
      'Methadone and Suboxone programs available',
      'Insurance not required - they have funding for uninsured patients',
      'Ask about their outpatient programs if you can\'t do residential',
    ],
    tipsEs: [
      'Admisión el mismo día a menudo disponible - llame temprano en la mañana',
      'Programas de metadona y Suboxone disponibles',
      'No se requiere seguro - tienen fondos para pacientes sin seguro',
      'Pregunte sobre programas ambulatorios si no puede hacer residencial',
    ],
    descriptionEs: 'Proveedor líder de tratamiento de adicciones en Connecticut. Ofrece terapia asistida con medicamentos (MAT), consejería y servicios ambulatorios.',
    howToApplyEs: 'Llame para una cita de admisión. Admisiones el mismo día a menudo disponibles.',
  },

  // ===== EMPLOYMENT =====
  'Career Resources Inc.': {
    tips: [
      'Free resume help and interview coaching available',
      'Computer lab for job searching - staff can help you apply online',
      'Ask about their job training programs - some pay you while training',
      'Business attire available for interviews through partner programs',
    ],
    tipsEs: [
      'Ayuda gratuita con currículum y preparación para entrevistas',
      'Laboratorio de computadoras para buscar trabajo - el personal puede ayudarlo',
      'Pregunte sobre programas de capacitación - algunos le pagan mientras se capacita',
      'Ropa profesional disponible para entrevistas',
    ],
    descriptionEs: 'Centro de empleo que ofrece capacitación laboral, colocación y servicios de carrera para residentes de Hartford.',
    howToApplyEs: 'Visite durante el horario de atención para registrarse. Traiga identificación y prueba de residencia.',
  },

  'Project MORE Foundation': {
    tips: [
      'Specifically helps people with criminal records find work',
      'Will advocate with employers on your behalf',
      'Know about companies that hire formerly incarcerated people',
      'Can help with getting IDs, birth certificates, and other documents',
    ],
    tipsEs: [
      'Ayuda específicamente a personas con antecedentes penales a encontrar trabajo',
      'Abogará con los empleadores en su nombre',
      'Conocen empresas que contratan personas anteriormente encarceladas',
      'Pueden ayudar a obtener identificaciones, certificados de nacimiento y otros documentos',
    ],
    descriptionEs: 'Asiste a personas que regresan de la encarcelación con empleo, vivienda y servicios de reintegración.',
    howToApplyEs: 'Llame o visite para una cita de admisión.',
  },

  // ===== LEGAL =====
  'Hartford Legal Assistance': {
    tips: [
      'Free legal help for low-income Hartford residents',
      'If facing eviction, call immediately - they may be able to represent you in court',
      'Can help with public benefits appeals (SNAP, TANF, disability denials)',
      'Immigration help available through separate immigration unit',
    ],
    tipsEs: [
      'Ayuda legal gratuita para residentes de bajos ingresos de Hartford',
      'Si enfrenta desalojo, llame inmediatamente - pueden representarlo en la corte',
      'Pueden ayudar con apelaciones de beneficios públicos',
      'Ayuda de inmigración disponible',
    ],
    descriptionEs: 'Servicios legales civiles gratuitos para residentes de bajos ingresos. Especializado en vivienda, beneficios públicos, familia e inmigración.',
    howToApplyEs: 'Llame a la línea de admisión para evaluación de elegibilidad.',
  },

  // ===== HOUSING ASSISTANCE =====
  'Elm City Communities (Housing Authority)': {
    tips: [
      'Section 8 waitlist is often long - apply and keep your info updated',
      'Public housing may have shorter waits than Section 8 vouchers',
      'Emergency transfers possible for domestic violence situations',
      'Keep copies of all paperwork you submit',
    ],
    tipsEs: [
      'La lista de espera de la Sección 8 es larga - solicite y mantenga su información actualizada',
      'La vivienda pública puede tener esperas más cortas que los vales de la Sección 8',
      'Transferencias de emergencia posibles para situaciones de violencia doméstica',
      'Guarde copias de todos los documentos que presente',
    ],
    descriptionEs: 'Autoridad de vivienda de Hartford. Administra vivienda pública y vales de la Sección 8 para familias de bajos ingresos.',
    howToApplyEs: 'Presente la solicitud en línea o en persona. Traiga identificación, comprobante de ingresos y referencias.',
  },

  'Christian Community Action': {
    tips: [
      'Their NEW HOPE program provides furnished apartments for up to 3 years',
      'Food pantry is separate from housing - you can use one or both',
      'Case managers really invest in helping you succeed',
      'Faith-based but serves everyone regardless of religion',
    ],
    tipsEs: [
      'Su programa NEW HOPE proporciona apartamentos amueblados por hasta 3 años',
      'La despensa de alimentos es separada de la vivienda - puede usar uno o ambos',
      'Los administradores de casos realmente invierten en ayudarlo a tener éxito',
      'Basado en la fe pero sirve a todos sin importar la religión',
    ],
    descriptionEs: 'Organización sin fines de lucro basada en la fe que proporciona despensa de alimentos, asistencia de vivienda y administración de casos.',
    howToApplyEs: 'Llame o visite para admisión.',
  },

  // ===== UTILITIES =====
  'TEAM Inc. - Energy Assistance': {
    tips: [
      'Apply in fall before heating season starts - funds run out',
      'Can help with past-due bills, not just current ones',
      'Weatherization program can lower your bills long-term',
      'Bring recent utility bills and proof of income to your appointment',
    ],
    tipsEs: [
      'Solicite en otoño antes de que comience la temporada de calefacción - los fondos se agotan',
      'Pueden ayudar con facturas atrasadas, no solo las actuales',
      'El programa de climatización puede reducir sus facturas a largo plazo',
      'Traiga facturas recientes de servicios públicos y comprobante de ingresos',
    ],
    descriptionEs: 'Agencia de acción comunitaria que proporciona asistencia energética (LIHEAP), climatización y otros servicios para familias de bajos ingresos.',
    howToApplyEs: 'Llame para una cita. Traiga identificación, comprobante de ingresos y facturas de servicios públicos.',
  },

  // ===== IMMIGRATION =====
  'IRIS - Integrated Refugee & Immigrant Services': {
    tips: [
      'Serves refugees, asylees, and other immigrants',
      'Legal services for asylum applications and green card renewals',
      'Job placement program specifically for immigrants',
      'ESL classes and cultural orientation available',
    ],
    tipsEs: [
      'Sirve a refugiados, asilados y otros inmigrantes',
      'Servicios legales para solicitudes de asilo y renovaciones de green card',
      'Programa de colocación laboral específicamente para inmigrantes',
      'Clases de inglés y orientación cultural disponibles',
    ],
    descriptionEs: 'Agencia de reasentamiento de refugiados que proporciona servicios completos para refugiados e inmigrantes incluyendo vivienda, empleo y servicios legales.',
    howToApplyEs: 'Llame o visite para una cita de admisión.',
  },

  'Junta for Progressive Action': {
    tips: [
      'Trusted in the Latino community for decades',
      'Citizenship and DACA renewal assistance',
      'Know Your Rights workshops - important information for immigrant families',
      'Services available in Spanish',
    ],
    tipsEs: [
      'De confianza en la comunidad latina por décadas',
      'Asistencia para ciudadanía y renovación de DACA',
      'Talleres de Conozca Sus Derechos - información importante para familias inmigrantes',
      'Servicios disponibles en español',
    ],
    descriptionEs: 'Organización comunitaria latina que proporciona servicios de inmigración, programas para jóvenes y defensa de la comunidad.',
    howToApplyEs: 'Llame o visite durante el horario de atención. Se habla español.',
  },

  // ===== VETERANS =====
  'VA Connecticut Healthcare - West Haven': {
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
      'Los consejeros de beneficios pueden ayudarlo a entender todos sus beneficios del VA',
    ],
    descriptionEs: 'Centro médico del VA que proporciona atención médica integral para veteranos, incluyendo atención primaria, salud mental y servicios especializados.',
    howToApplyEs: 'Llame o visite la oficina de inscripción. Traiga su DD-214 si lo tiene.',
  },

  // ===== CHILDCARE =====
  'All Our Kin': {
    tips: [
      'Connects families with licensed family childcare providers',
      'Providers are vetted and trained - safe for your kids',
      'Many providers accept Care4Kids subsidies',
      'Spanish-speaking providers available',
    ],
    tipsEs: [
      'Conecta familias con proveedores de cuidado infantil familiar licenciados',
      'Los proveedores son examinados y capacitados - seguros para sus hijos',
      'Muchos proveedores aceptan subsidios de Care4Kids',
      'Proveedores hispanohablantes disponibles',
    ],
    descriptionEs: 'Red de proveedores de cuidado infantil familiar licenciados. Ayuda a las familias a encontrar cuidado infantil de calidad y asequible.',
    howToApplyEs: 'Llame o visite el sitio web para encontrar un proveedor en su área.',
  },

  // ===== ADDITIONAL RESOURCES =====
  'United Way 211': {
    tips: [
      'Available 24/7 - call anytime, even at night',
      'Operators can search for resources you might not know exist',
      'Can help in multiple languages',
      'Text your zip code to 898211 for quick resource links',
    ],
    tipsEs: [
      'Disponible 24/7 - llame en cualquier momento, incluso de noche',
      'Los operadores pueden buscar recursos que quizás no sepa que existen',
      'Pueden ayudar en múltiples idiomas',
      'Envíe un mensaje de texto con su código postal al 898211',
    ],
    descriptionEs: 'Línea de información y referencia 24/7 que conecta a las personas con servicios de salud y humanos en su comunidad.',
    howToApplyEs: 'Llame al 211 o visite 211ct.org. Disponible 24/7.',
  },

  'Department of Social Services (DSS) - Hartford': {
    tips: [
      'Apply online at connect.ct.gov to avoid long waits',
      'Bring all income documentation - pay stubs, benefits letters, etc.',
      'Ask specifically about expedited SNAP if you have less than $100 and low income',
      'If denied, you have the right to appeal - ask for a fair hearing',
    ],
    tipsEs: [
      'Solicite en línea en connect.ct.gov para evitar largas esperas',
      'Traiga toda la documentación de ingresos - talones de pago, cartas de beneficios, etc.',
      'Pregunte específicamente sobre SNAP acelerado si tiene menos de $100',
      'Si le niegan, tiene derecho a apelar - solicite una audiencia justa',
    ],
    descriptionEs: 'Oficina estatal que administra SNAP (cupones de alimentos), Medicaid, TANF (asistencia en efectivo) y otros programas de beneficios.',
    howToApplyEs: 'Solicite en línea en connect.ct.gov, por teléfono o en persona. Traiga identificación y comprobante de ingresos.',
  },

  'Beulah Heights Social Integration Program': {
    tips: [
      'Saturday warming center includes free breakfast and lunch',
      'Van picks up from Hartford Green - check the schedule',
      'Especially welcoming to people returning from incarceration',
      'Resource center can help with IDs, jobs, and housing referrals',
    ],
    tipsEs: [
      'El centro de calentamiento del sábado incluye desayuno y almuerzo gratis',
      'La camioneta recoge desde el Hartford Green - consulte el horario',
      'Especialmente acogedor para personas que regresan de la encarcelación',
      'El centro de recursos puede ayudar con identificaciones, empleos y referencias de vivienda',
    ],
    descriptionEs: 'Servicios integrales para personas sin hogar y aquellos que regresan de la encarcelación. Centro de calentamiento, comidas, centro de recursos y transporte.',
    howToApplyEs: 'Preséntese el sábado o llame para otros servicios.',
  },

  'The Spiritual Fellowship': {
    tips: [
      'Safe space for people struggling with addiction or mental health',
      'Meal included - come hungry',
      'Not preachy - focused on support and community',
      'Staff understands what you\'re going through',
    ],
    tipsEs: [
      'Espacio seguro para personas que luchan con adicción o salud mental',
      'Comida incluida - venga con hambre',
      'No es sermoneador - enfocado en apoyo y comunidad',
      'El personal entiende por lo que está pasando',
    ],
    descriptionEs: 'Comunidad de apoyo para personas que luchan con adicción, enfermedad mental y falta de vivienda. Incluye comida y compañerismo.',
    howToApplyEs: 'Preséntese. Todos son bienvenidos.',
  },

  'Jewish Family Service of Greater Hartford': {
    tips: [
      'Serves everyone, not just Jewish families',
      'Strong refugee resettlement program',
      'Sliding scale counseling services',
      'Emergency financial assistance available',
    ],
    tipsEs: [
      'Sirve a todos, no solo a familias judías',
      'Programa sólido de reasentamiento de refugiados',
      'Servicios de consejería con tarifa escalonada',
      'Asistencia financiera de emergencia disponible',
    ],
    descriptionEs: 'Consejería, servicios para personas mayores, reasentamiento de refugiados y asistencia de emergencia. Sirve a todas las religiones.',
    howToApplyEs: 'Llame para admisión.',
  },

  'St. Vincent de Paul Society - Hartford': {
    tips: [
      'Help comes through home visits - someone will come to you',
      'Can help with rent, utilities, food, and other emergency needs',
      'Contact your local Catholic parish to be connected to your neighborhood conference',
      'Help is given with dignity and confidentiality',
    ],
    tipsEs: [
      'La ayuda viene a través de visitas a domicilio - alguien vendrá a usted',
      'Pueden ayudar con alquiler, servicios públicos, comida y otras necesidades de emergencia',
      'Contacte a su parroquia católica local para conectarse con su conferencia del vecindario',
      'La ayuda se da con dignidad y confidencialidad',
    ],
    descriptionEs: 'Caridad católica que proporciona asistencia financiera de emergencia para alquiler, servicios públicos, comida y otras necesidades básicas a través de visitas a domicilio.',
    howToApplyEs: 'Contacte a la parroquia católica local para referencia a su conferencia del vecindario.',
  },
}

async function main() {
  console.log('Adding organization-specific tips and Spanish translations...\n')

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
          nameEs: data.nameEs || null,
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
