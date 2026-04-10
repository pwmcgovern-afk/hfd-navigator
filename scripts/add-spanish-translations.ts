import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Spanish translations for resources
const translations: Record<string, { descriptionEs: string; howToApplyEs?: string }> = {
  'Neighborhood Housing Services of Hartford': {
    descriptionEs: 'Organización sin fines de lucro que ayuda a residentes de Hartford a comprar, mantener y mejorar sus hogares. Ofrece asesoría de vivienda, préstamos para reparaciones del hogar y programas de compradores por primera vez.',
    howToApplyEs: 'Llame para programar una cita de asesoramiento.'
  },
  'HOPWA Housing Assistance': {
    descriptionEs: 'Asistencia de vivienda para personas viviendo con VIH/SIDA. Proporciona asistencia con el alquiler, servicios públicos y apoyo de vivienda de emergencia.',
    howToApplyEs: 'Contacte el programa para evaluación de elegibilidad.'
  },
  'Hartford Food Policy Council - Community Fridges': {
    descriptionEs: 'Refrigeradores comunitarios ubicados en Hartford donde cualquiera puede tomar o dejar comida gratis. Disponible 24/7, sin preguntas.',
    howToApplyEs: 'Solo acérquese - no se requiere registro.'
  },
  'Loaves & Fishes Food Pantry': {
    descriptionEs: 'Despensa de alimentos que sirve a familias e individuos necesitados en Hartford. Proporciona comestibles y artículos básicos.',
    howToApplyEs: 'Visite durante las horas de operación con identificación.'
  },
  'Community Action Agency of Hartford - Emergency Assistance': {
    descriptionEs: 'Proporciona asistencia de emergencia para alquiler, servicios públicos y otras necesidades básicas. Ayuda a familias de bajos ingresos a estabilizarse y evitar el desalojo o cierre de servicios.',
    howToApplyEs: 'Llame para programar una cita de admisión.'
  },
  'State Emergency Assistance (EA)': {
    descriptionEs: 'Asistencia de emergencia del estado de Connecticut para familias con niños que enfrentan falta de vivienda. Proporciona asistencia con alquiler y refugio temporal.',
    howToApplyEs: 'Solicite en la oficina local de DSS o en línea en ct.gov/dss.'
  },
  'General Assistance': {
    descriptionEs: 'Programa municipal que proporciona asistencia en efectivo a adultos sin niños que están desempleados o no pueden trabajar. Cubre necesidades básicas mientras busca empleo o beneficios.',
    howToApplyEs: 'Solicite en el departamento de servicios sociales de la ciudad.'
  },
  'Yale Hartford Hospital - Emergency Suboxone': {
    descriptionEs: 'Inducción de buprenorfina (Suboxone) en la sala de emergencias para pacientes con trastorno por uso de opioides. Conecta a los pacientes con tratamiento continuo.',
    howToApplyEs: 'Vaya a la sala de emergencias y diga que necesita ayuda con la adicción a opioides.'
  },
  'Yale Hartford Hospital - Financial Assistance': {
    descriptionEs: 'Programa de asistencia financiera para pacientes que no pueden pagar sus facturas médicas. Proporciona descuentos y atención de caridad basados en ingresos.',
    howToApplyEs: 'Pregunte al departamento de facturación o al trabajador social sobre la solicitud.'
  },
  'Transitions Clinic - Reentry Healthcare': {
    descriptionEs: 'Clínica de atención primaria especializada en servir a pacientes que salen de la encarcelación. Proporciona atención médica integral y navegación de recursos.',
    howToApplyEs: 'Llame para programar una cita. Se aceptan pacientes sin seguro.'
  },
  'CTWorks Hartford': {
    descriptionEs: 'Centro de carreras que proporciona asistencia para búsqueda de empleo, capacitación laboral y servicios de empleo. Parte de la red de Centros de Empleo Americanos.',
    howToApplyEs: 'Visite el centro durante las horas de operación o regístrese en línea.'
  },
  'Greater Hartford Transit District': {
    descriptionEs: 'Servicio de paratránsito para personas mayores y personas con discapacidades que no pueden usar el transporte público regular. Proporciona servicio de puerta a puerta.',
    howToApplyEs: 'Llame para solicitar una evaluación de elegibilidad.'
  },
  'UI Matching Payment Program': {
    descriptionEs: 'Programa de asistencia con servicios públicos de United Illuminating. Iguala los pagos de los clientes para ayudar a pagar las facturas atrasadas.',
    howToApplyEs: 'Contacte a UI o una agencia de acción comunitaria para solicitar.'
  },
  'Varick AME Zion Church Food Pantry': {
    descriptionEs: 'Despensa de alimentos basada en la iglesia que sirve a la comunidad de Hartford. Proporciona comestibles y comidas calientes.',
    howToApplyEs: 'Visite durante las horas de la despensa.'
  },
  'St. Ann Food Pantry & Soup Kitchen': {
    descriptionEs: 'Despensa de alimentos y comedor de beneficencia que sirve comidas calientes y comestibles a los necesitados. Operado por la Iglesia de Santa Ana.',
    howToApplyEs: 'Visite durante las horas de comedor o despensa.'
  },
  'Macedonia Church Food Pantry': {
    descriptionEs: 'Despensa de alimentos basada en la iglesia que proporciona comestibles a familias necesitadas en Hartford.',
    howToApplyEs: 'Visite durante las horas de distribución.'
  },
  'Community Baptist Church Mobile Food Pantry': {
    descriptionEs: 'Despensa móvil de alimentos que lleva productos frescos y comestibles a vecindarios de Hartford.',
    howToApplyEs: 'Revise el horario de ubicaciones y visite.'
  },
  'Hillside Family Shelter': {
    descriptionEs: 'Refugio de emergencia para familias sin hogar en Hartford. Proporciona vivienda temporal y servicios de apoyo.',
    howToApplyEs: 'Llame a la línea de admisión de acceso coordinado.'
  },
  'Continuum of Care Emergency Housing': {
    descriptionEs: 'Sistema de vivienda de emergencia y transicional para personas y familias sin hogar. Conecta a personas con refugio y servicios.',
    howToApplyEs: 'Llame al 211 o vaya a un refugio local para evaluación.'
  },
  'New Reach - CareWays Shelter': {
    descriptionEs: 'Refugio de emergencia y servicios de vivienda para personas y familias sin hogar. Proporciona manejo de casos y conexiones con vivienda permanente.',
    howToApplyEs: 'Contacte la línea de admisión de New Reach.'
  },
  'Hartford Health Department - Health Center': {
    descriptionEs: 'Centro de salud del departamento de salud de la ciudad que proporciona atención primaria de bajo costo, vacunas y servicios de salud pública.',
    howToApplyEs: 'Llame para programar una cita.'
  },
  'Project Access Hartford': {
    descriptionEs: 'Conecta a pacientes sin seguro con atención médica especializada gratuita proporcionada por médicos voluntarios.',
    howToApplyEs: 'Debe ser referido por un proveedor de atención primaria.'
  },
  'MCCA Hartford Outpatient': {
    descriptionEs: 'Tratamiento ambulatorio de abuso de sustancias y servicios de salud mental. Ofrece consejería individual y grupal.',
    howToApplyEs: 'Llame para una evaluación de admisión.'
  },
  'SATU - Yale Addiction Treatment': {
    descriptionEs: 'Servicios de tratamiento de adicciones basados en Yale incluyendo terapia asistida por medicamentos y consejería para trastornos por uso de sustancias.',
    howToApplyEs: 'Llame para programar una evaluación.'
  },
  'CASA Inc - MAAS Day Treatment': {
    descriptionEs: 'Programa de tratamiento diurno para trastornos por uso de sustancias. Proporciona tratamiento ambulatorio intensivo durante el día.',
    howToApplyEs: 'Llame para información de admisión.'
  },
  'Grant Street Partnership': {
    descriptionEs: 'Servicios de reducción de daños y apoyo de vivienda para personas afectadas por el uso de drogas. Proporciona enfoque de bajo umbral.',
    howToApplyEs: 'Visite o llame para conectarse con servicios.'
  },
  'Crossroads Recovery Center': {
    descriptionEs: 'Centro de tratamiento de adicciones que proporciona servicios de recuperación y consejería para trastornos por uso de sustancias.',
    howToApplyEs: 'Llame para información de admisión.'
  },
  'Workforce Alliance': {
    descriptionEs: 'Proporciona capacitación laboral, becas de capacitación y servicios de empleo para buscadores de empleo en el centro sur de Connecticut.',
    howToApplyEs: 'Visite el Centro de Empleo Americano o aplique en línea.'
  },
  'American Job Center - Hartford': {
    descriptionEs: 'Centro de carreras único que proporciona servicios de empleo, asistencia para búsqueda de trabajo y capacitación para buscadores de empleo.',
    howToApplyEs: 'Visite el centro durante las horas de operación.'
  },
  'ConnCAT Job Training': {
    descriptionEs: 'Programas gratuitos de capacitación laboral para adultos y jóvenes de Connecticut. Ofrece capacitación en campos de alta demanda.',
    howToApplyEs: 'Aplique en línea o visite el centro.'
  },
  'Hartford Works': {
    descriptionEs: 'Programa de capacitación laboral y empleo que conecta a residentes de Hartford con empleos locales y capacitación.',
    howToApplyEs: 'Regístrese en línea o visite la oficina.'
  },
  'Connecticut Energy Assistance Program (CEAP)': {
    descriptionEs: 'Asistencia con servicios públicos para hogares de bajos ingresos para ayudar a pagar facturas de calefacción y energía.',
    howToApplyEs: 'Aplique a través de una agencia de acción comunitaria local.'
  },
  'Winter Utility Shut-Off Protection': {
    descriptionEs: 'Protección contra desconexión de servicios durante meses de invierno para hogares elegibles. Evita que las empresas de servicios públicos corten el servicio.',
    howToApplyEs: 'Contacte a su empresa de servicios públicos o aplique para asistencia energética.'
  },
  'CT Safe Connect': {
    descriptionEs: 'Línea de ayuda para víctimas de violencia doméstica y agresión sexual. Proporciona apoyo de crisis, planificación de seguridad y referencias.',
    howToApplyEs: 'Llame o envíe un mensaje de texto a la línea de ayuda.'
  },
  'LEAP - Leadership Education Athletics Partnership': {
    descriptionEs: 'Programas después de la escuela y de verano para niños y jóvenes de Hartford. Proporciona enriquecimiento académico, deportes y mentoría.',
    howToApplyEs: 'Regístrese a través de la escuela o contacte a LEAP directamente.'
  },
  'CT Legal Services - Hartford': {
    descriptionEs: 'Asistencia legal gratuita para residentes de bajos ingresos en casos civiles incluyendo vivienda, familia, beneficios y problemas del consumidor.',
    howToApplyEs: 'Llame a la línea de admisión para aplicar.'
  },
  'Immanuel Baptist Church Clothes Closet': {
    descriptionEs: 'Closet de ropa gratuita que proporciona ropa a los necesitados. Operado por la Iglesia Bautista Immanuel.',
    howToApplyEs: 'Visite durante las horas de operación.'
  },
  'Bethel AME Church Food Pantry': {
    descriptionEs: 'Despensa de alimentos basada en la iglesia que sirve a la comunidad de Dixwell/Newhallville. Parte de la misión histórica de la iglesia AME.',
    howToApplyEs: 'Visite durante las horas de distribución.'
  },
  'Moved With Compassion Ministry': {
    descriptionEs: 'Ministerio de alcance que proporciona alimentos, ropa y apoyo a los necesitados en Hartford.',
    howToApplyEs: 'Contacte el ministerio para información.'
  },
  'Mount Hope Temple Food Pantry': {
    descriptionEs: 'Despensa de alimentos del templo que sirve comestibles a familias de Hartford.',
    howToApplyEs: 'Visite durante las horas de distribución.'
  },
  'Pitts Chapel Baptist Church Food Pantry': {
    descriptionEs: 'Despensa de alimentos de la iglesia que proporciona comestibles a la comunidad.',
    howToApplyEs: 'Visite durante las horas de la despensa.'
  },
  "St. Luke's Services Food Pantry": {
    descriptionEs: 'Despensa de alimentos que sirve comestibles y artículos básicos a los necesitados.',
    howToApplyEs: 'Visite durante las horas de operación.'
  },
  "St. Matthew's Unison Freewill Baptist Food Pantry": {
    descriptionEs: 'Despensa de alimentos de la iglesia que sirve a la comunidad de Hartford.',
    howToApplyEs: 'Visite durante las horas de distribución.'
  },
  'Omega SDA Church Community Service': {
    descriptionEs: 'Servicios comunitarios incluyendo distribución de alimentos y asistencia para los necesitados.',
    howToApplyEs: 'Contacte la iglesia para horarios de servicio.'
  },
  'Dixwell Avenue Congregational UCC': {
    descriptionEs: 'Iglesia histórica que ofrece programas comunitarios, apoyo espiritual y servicios sociales.',
    howToApplyEs: 'Contacte la iglesia o visite durante los servicios.'
  },
  'Trinity Community Grants Program': {
    descriptionEs: 'Programa de subvenciones que proporciona asistencia financiera de emergencia a residentes necesitados.',
    howToApplyEs: 'Aplique a través del programa de subvenciones.'
  },
  'First Calvary Baptist Church': {
    descriptionEs: 'Iglesia que ofrece servicios de apoyo espiritual, consejería y programas comunitarios.',
    howToApplyEs: 'Contacte la iglesia para información sobre servicios.'
  },
  'St. Rose of Lima Church - Food Pantry': {
    descriptionEs: 'Despensa de alimentos de la iglesia católica que sirve a la comunidad de Hartford.',
    howToApplyEs: 'Visite durante las horas de la despensa.'
  },
  'St. Francis Church & St. Rose of Lima - ESL Classes': {
    descriptionEs: 'Clases de inglés como segundo idioma (ESL) gratuitas para adultos inmigrantes.',
    howToApplyEs: 'Regístrese en la iglesia para las clases.'
  },
  'Masjid Al-Islam Food Pantry': {
    descriptionEs: 'Despensa de alimentos de la mezquita que sirve a todos los necesitados en la comunidad.',
    howToApplyEs: 'Visite durante las horas de distribución.'
  },
  'Mercy Center': {
    descriptionEs: 'Centro de retiro y espiritualidad que ofrece consejería, apoyo espiritual y programas de bienestar.',
    howToApplyEs: 'Contacte el centro para programas disponibles.'
  }
}

async function main() {
  console.log('Adding Spanish translations to resources...')

  let updated = 0

  for (const [name, trans] of Object.entries(translations)) {
    const resource = await prisma.resource.findFirst({
      where: { name }
    })

    if (!resource) {
      console.log(`⚠️  Not found: ${name}`)
      continue
    }

    if (resource.descriptionEs) {
      console.log(`⏭️  Already has translation: ${name}`)
      continue
    }

    await prisma.resource.update({
      where: { id: resource.id },
      data: {
        descriptionEs: trans.descriptionEs,
        howToApplyEs: trans.howToApplyEs || resource.howToApplyEs
      }
    })

    console.log(`✅ Updated: ${name}`)
    updated++
  }

  console.log(`\nDone! Updated ${updated} resources with Spanish translations.`)

  // Check remaining
  const remaining = await prisma.resource.count({ where: { descriptionEs: null } })
  console.log(`Resources still missing translations: ${remaining}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
