import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Spanish translations for all resources
// nameEs and descriptionEs for every resource in the database
const translations: Record<string, { nameEs: string; descriptionEs: string; howToApplyEs?: string }> = {
  // ===== HOUSING =====
  'Columbus House Emergency Shelter': {
    nameEs: 'Refugio de Emergencia Columbus House',
    descriptionEs: 'Refugio de emergencia y servicios de vivienda para personas sin hogar. Proporciona comidas, manejo de casos y conexiones con vivienda permanente.',
    howToApplyEs: 'Preséntese en el refugio o llame para evaluación de admisión.'
  },
  'Hartford Housing Authority (Elm City Communities)': {
    nameEs: 'Autoridad de Vivienda de Hartford (Elm City Communities)',
    descriptionEs: 'Vivienda pública y Vales de Elección de Vivienda Sección 8 para familias de bajos ingresos, ancianos y personas con discapacidades.',
    howToApplyEs: 'Aplique en línea o visite la oficina. La lista de espera puede ser de varios años.'
  },
  'Liberty Community Services - Rapid Rehousing': {
    nameEs: 'Liberty Community Services - Realojamiento Rápido',
    descriptionEs: 'Programa de realojamiento rápido que ayuda a familias e individuos a salir rápidamente de la falta de vivienda mediante asistencia con el alquiler y manejo de casos.',
    howToApplyEs: 'Referido a través de la Red de Acceso Coordinado (CAN). Llame al 211.'
  },
  'Neighborhood Housing Services of Hartford': {
    nameEs: 'Servicios de Vivienda del Vecindario de Hartford',
    descriptionEs: 'Educación para compradores de vivienda, prevención de ejecuciones hipotecarias y asistencia con el pago inicial para compradores primerizos.',
    howToApplyEs: 'Llame para programar una cita de asesoramiento.'
  },
  'HOPWA Housing Assistance': {
    nameEs: 'Asistencia de Vivienda HOPWA',
    descriptionEs: 'Oportunidades de Vivienda para Personas con SIDA (HOPWA) proporciona asistencia con el alquiler, servicios públicos y servicios de apoyo para personas viviendo con VIH/SIDA.',
    howToApplyEs: 'Contacte la Autoridad de Vivienda de la Ciudad de Hartford.'
  },

  // ===== FOOD =====
  'Connecticut Food Bank - Hartford': {
    nameEs: 'Banco de Alimentos de Connecticut - Hartford',
    descriptionEs: 'Distribución de alimentos a gran escala sirviendo agencias asociadas y despensas móviles de alimentos en el área metropolitana de Hartford.',
    howToApplyEs: 'Visite ctfoodbank.org/find-food para localizar una despensa cerca de usted.'
  },
  'Hartford Food Policy Council - Community Fridges': {
    nameEs: 'Consejo de Política Alimentaria - Refrigeradores Comunitarios',
    descriptionEs: 'Red de refrigeradores comunitarios en Hartford que proporcionan comida gratis las 24 horas, sin preguntas.',
    howToApplyEs: 'Visite cualquier refrigerador comunitario. Tome lo que necesite, deje lo que pueda.'
  },
  'Downtown Evening Soup Kitchen (DESK)': {
    nameEs: 'Comedor Nocturno del Centro (DESK)',
    descriptionEs: 'Cena caliente gratuita servida todas las noches, además de manejo de casos, servicios sociales y conexiones con vivienda.',
    howToApplyEs: 'Preséntese durante las horas de cena. No se requiere identificación ni registro.'
  },
  'Loaves & Fishes Food Pantry': {
    nameEs: 'Despensa de Alimentos Loaves & Fishes',
    descriptionEs: 'Despensa de alimentos semanal que proporciona comestibles a residentes de Hartford necesitados.',
    howToApplyEs: 'Traiga identificación que muestre dirección en Hartford. Primer llegado, primer servido.'
  },
  'SNAP/Food Stamps Enrollment': {
    nameEs: 'Inscripción en SNAP/Cupones de Alimentos',
    descriptionEs: 'SNAP (Programa de Asistencia Nutricional Suplementaria) proporciona beneficios mensuales para comprar comestibles.',
    howToApplyEs: 'Aplique en línea en ct.gov/dss o llame a la línea de ayuda. Traiga identificación, prueba de ingresos y residencia.'
  },

  // ===== CASH ASSISTANCE =====
  'TANF Cash Assistance': {
    nameEs: 'Asistencia en Efectivo TANF',
    descriptionEs: 'Asistencia Temporal para Familias Necesitadas (TANF) proporciona asistencia en efectivo mensual para familias con niños.',
    howToApplyEs: 'Aplique en la oficina local de DSS o en línea.'
  },
  'Community Action Agency of Hartford - Emergency Assistance': {
    nameEs: 'Agencia de Acción Comunitaria de Hartford - Asistencia de Emergencia',
    descriptionEs: 'Asistencia financiera de emergencia para alquiler, depósitos de seguridad y facturas de servicios públicos para residentes elegibles por ingresos.',
    howToApplyEs: 'Llame para una cita. Traiga prueba de ingresos, identificación y documentación de la emergencia.'
  },
  'State Emergency Assistance (EA)': {
    nameEs: 'Asistencia de Emergencia Estatal (EA)',
    descriptionEs: 'Pagos de emergencia únicos para familias con niños que enfrentan desalojo o corte de servicios públicos.',
    howToApplyEs: 'Contacte DSS con el aviso de desalojo o aviso de corte.'
  },
  'General Assistance': {
    nameEs: 'Asistencia General',
    descriptionEs: 'Asistencia en efectivo temporal para adultos solteros sin niños que no pueden trabajar.',
    howToApplyEs: 'Aplique en la oficina de Servicios Sociales de Hartford.'
  },

  // ===== HARM REDUCTION =====
  'APT Foundation - Syringe Services': {
    nameEs: 'Fundación APT - Servicios de Jeringas',
    descriptionEs: 'Intercambio gratuito de jeringas, distribución de Narcan, pruebas de VIH/Hepatitis C y conexiones con tratamiento.',
    howToApplyEs: 'Preséntese para intercambio de jeringas. No se necesita cita.'
  },
  'Cornell Scott-Hill Health Center - MAT Program': {
    nameEs: 'Centro de Salud Cornell Scott-Hill - Programa MAT',
    descriptionEs: 'Tratamiento Asistido con Medicamentos (MAT) para trastorno por uso de opioides incluyendo Suboxone y consejería.',
    howToApplyEs: 'Llame para programar una cita de admisión. Inicio el mismo día disponible.'
  },
  'Free Narcan Distribution': {
    nameEs: 'Distribución Gratuita de Narcan',
    descriptionEs: 'Kits gratuitos de naloxona (Narcan) para prevenir muertes por sobredosis de opioides. Se proporciona capacitación.',
    howToApplyEs: 'Llame para ubicaciones de distribución o visite cualquier farmacia participante.'
  },
  'Yale Hartford Hospital - Emergency Suboxone': {
    nameEs: 'Hospital Yale Hartford - Suboxone de Emergencia',
    descriptionEs: 'El departamento de emergencias puede iniciar tratamiento con Suboxone para trastorno por uso de opioides con receta puente y referido a tratamiento.',
    howToApplyEs: 'Vaya al Departamento de Emergencias.'
  },

  // ===== HEALTHCARE =====
  'Cornell Scott-Hill Health Center - Primary Care': {
    nameEs: 'Centro de Salud Cornell Scott-Hill - Atención Primaria',
    descriptionEs: 'El primer FQHC de Connecticut que proporciona atención primaria, dental, salud conductual y servicios de farmacia con escala de pago variable.',
    howToApplyEs: 'Llame para programar una cita. Tarifa variable para pacientes sin seguro.'
  },
  'Fair Haven Community Health Care': {
    nameEs: 'Atención de Salud Comunitaria de Fair Haven',
    descriptionEs: 'FQHC que proporciona atención primaria integral, dental, OB/GYN, pediatría y salud conductual.',
    howToApplyEs: 'Llame para programar. Tarifa variable disponible para personas sin seguro.'
  },
  'HUSKY Health (Medicaid) Enrollment': {
    nameEs: 'Inscripción en HUSKY Health (Medicaid)',
    descriptionEs: 'Seguro de salud gratuito o de bajo costo para niños, mujeres embarazadas, padres y adultos a través de Medicaid de Connecticut.',
    howToApplyEs: 'Aplique en línea en accesshealthct.com o llame para asistencia.'
  },
  'Yale Hartford Hospital - Financial Assistance': {
    nameEs: 'Hospital Yale Hartford - Asistencia Financiera',
    descriptionEs: 'Programa de asistencia financiera para pacientes sin seguro o con seguro insuficiente para reducir facturas hospitalarias.',
    howToApplyEs: 'Contacte Asesoría Financiera antes o después de su visita.'
  },
  'Transitions Clinic - Reentry Healthcare': {
    nameEs: 'Clínica de Transiciones - Atención Médica de Reingreso',
    descriptionEs: 'Clínica de atención primaria específicamente para personas recientemente liberadas de la encarcelación, con trabajadores comunitarios de salud con experiencia vivida.',
    howToApplyEs: 'Llame para programar. Abierto a cualquier persona liberada en los últimos 6 meses.'
  },

  // ===== MENTAL HEALTH =====
  'Connecticut Mental Health Center': {
    nameEs: 'Centro de Salud Mental de Connecticut',
    descriptionEs: 'Servicios integrales de salud mental incluyendo terapia ambulatoria, atención psiquiátrica, servicios de crisis y manejo de casos.',
    howToApplyEs: 'Llame para cita de admisión o preséntese durante horas de crisis.'
  },
  '988 Suicide & Crisis Lifeline': {
    nameEs: 'Línea de Prevención del Suicidio y Crisis 988',
    descriptionEs: 'Apoyo gratuito y confidencial las 24 horas para personas en crisis suicida o angustia emocional.',
    howToApplyEs: 'Llame o envíe un mensaje de texto al 988 en cualquier momento.'
  },
  'Mobile Crisis Team': {
    nameEs: 'Equipo Móvil de Crisis',
    descriptionEs: 'Intervención de crisis móvil las 24 horas para adultos que experimentan emergencias psiquiátricas. Pueden ir a su ubicación.',
    howToApplyEs: 'Llame a la línea de crisis. Un equipo será enviado a su ubicación.'
  },
  'BHcare Counseling': {
    nameEs: 'Consejería BHcare',
    descriptionEs: 'Servicios ambulatorios de salud mental y consejería de adicciones en el área metropolitana de Hartford.',
    howToApplyEs: 'Llame para cita de admisión.'
  },

  // ===== EMPLOYMENT =====
  'CTWorks Hartford': {
    nameEs: 'CTWorks Hartford',
    descriptionEs: 'Asistencia gratuita para búsqueda de empleo, ayuda con currículum, preparación para entrevistas y programas de capacitación laboral.',
    howToApplyEs: 'Preséntese o regístrese en línea.'
  },
  'Career Resources Inc': {
    nameEs: 'Career Resources Inc',
    descriptionEs: 'Capacitación laboral, desarrollo de habilidades y servicios de empleo para adultos y jóvenes.',
    howToApplyEs: 'Llame o visite para inscribirse en programas.'
  },
  'Project MORE Reentry Employment': {
    nameEs: 'Proyecto MORE - Empleo de Reingreso',
    descriptionEs: 'Servicios de empleo específicamente para personas que regresan de la encarcelación, incluyendo colocación laboral y apoyo de retención.',
    howToApplyEs: 'Llame para cita de admisión.'
  },

  // ===== CHILDCARE =====
  'Care 4 Kids Childcare Subsidy': {
    nameEs: 'Subsidio de Cuidado Infantil Care 4 Kids',
    descriptionEs: 'Subsidios de cuidado infantil para familias trabajadoras de bajos ingresos para pagar proveedores de cuidado infantil con licencia.',
    howToApplyEs: 'Aplique en línea en ctcare4kids.com'
  },
  'Hartford Head Start': {
    nameEs: 'Head Start de Hartford',
    descriptionEs: 'Programa preescolar gratuito para niños de 3-5 años de familias de bajos ingresos, incluyendo comidas y exámenes de salud.',
    howToApplyEs: 'Aplique a través de las Escuelas Públicas de Hartford.'
  },
  'All Our Kin Family Childcare': {
    nameEs: 'Cuidado Infantil Familiar All Our Kin',
    descriptionEs: 'Red de proveedores de cuidado infantil familiar con licencia en Hartford, muchos aceptan subsidios Care 4 Kids.',
    howToApplyEs: 'Contacte para ayuda para encontrar un proveedor de cuidado infantil familiar.'
  },

  // ===== LEGAL AID =====
  'Hartford Legal Assistance Association': {
    nameEs: 'Asociación de Asistencia Legal de Hartford',
    descriptionEs: 'Servicios legales civiles gratuitos para residentes de bajos ingresos de Hartford, incluyendo vivienda, beneficios y derecho familiar.',
    howToApplyEs: 'Llame para evaluación de admisión.'
  },
  'Eviction Defense - Greater Hartford': {
    nameEs: 'Defensa contra Desalojos - Gran Hartford',
    descriptionEs: 'Asistencia legal para inquilinos que enfrentan desalojo, incluyendo representación en tribunales y negociaciones con propietarios.',
    howToApplyEs: 'Llame inmediatamente si recibe un aviso de desalojo.'
  },
  'Clean Slate CT - Record Expungement': {
    nameEs: 'Clean Slate CT - Eliminación de Antecedentes',
    descriptionEs: 'Ayuda con eliminación de antecedentes penales y perdones para eliminar barreras al empleo y la vivienda.',
    howToApplyEs: 'Llame para evaluación de elegibilidad.'
  },

  // ===== TRANSPORTATION =====
  'CT Transit - Reduced Fare': {
    nameEs: 'CT Transit - Tarifa Reducida',
    descriptionEs: 'Tarifas de autobús reducidas para personas mayores, personas con discapacidades y beneficiarios de Medicare.',
    howToApplyEs: 'Aplique para identificación de tarifa reducida en la oficina de CT Transit con prueba de elegibilidad.'
  },
  'Medical Rides - VEYO': {
    nameEs: 'Transporte Médico - VEYO',
    descriptionEs: 'Transporte médico no emergente gratuito para miembros de Medicaid a médicos, farmacias y tratamiento.',
    howToApplyEs: 'Llame al menos 3 días hábiles antes de su cita.'
  },
  'Greater Hartford Transit District': {
    nameEs: 'Distrito de Tránsito del Gran Hartford',
    descriptionEs: 'Paratránsito y transporte a demanda para personas mayores y personas con discapacidades.',
    howToApplyEs: 'Llame para registrarse y programar viajes.'
  },

  // ===== UTILITIES =====
  'LIHEAP - Heating Assistance': {
    nameEs: 'LIHEAP - Asistencia de Calefacción',
    descriptionEs: 'El Programa de Asistencia Energética para Hogares de Bajos Ingresos ayuda a pagar facturas de calefacción para hogares elegibles por ingresos.',
    howToApplyEs: 'Aplique a través de CAANH con prueba de ingresos y facturas de servicios públicos.'
  },
  'Operation Fuel': {
    nameEs: 'Operation Fuel',
    descriptionEs: 'Asistencia energética de emergencia durante todo el año para hogares no elegibles para LIHEAP.',
    howToApplyEs: 'Aplique a través de una agencia asociada o llame para referido.'
  },
  'UI Matching Payment Program': {
    nameEs: 'Programa de Pagos Equivalentes de UI',
    descriptionEs: 'UI iguala los pagos de los clientes dólar por dólar para ayudar a pagar saldos vencidos.',
    howToApplyEs: 'Llame al servicio al cliente de UI para inscribirse.'
  },

  // ===== IMMIGRATION =====
  'IRIS - Integrated Refugee & Immigrant Services': {
    nameEs: 'IRIS - Servicios Integrados para Refugiados e Inmigrantes',
    descriptionEs: 'Servicios legales, apoyo de reasentamiento, empleo y clases de inglés para refugiados e inmigrantes.',
    howToApplyEs: 'Llame para cita de admisión.'
  },
  'Junta for Progressive Action': {
    nameEs: 'Junta para la Acción Progresista',
    descriptionEs: 'Servicios legales de inmigración, organización comunitaria y defensa para la comunidad latina.',
    howToApplyEs: 'Llame para admisión de servicios legales.'
  },
  'Hartford Elm City ID': {
    nameEs: 'Identificación Elm City de Hartford',
    descriptionEs: 'Tarjeta de identificación municipal para todos los residentes de Hartford sin importar el estatus migratorio. Aceptada para servicios de la ciudad.',
    howToApplyEs: 'Visite el Ayuntamiento con prueba de identidad y residencia en Hartford.'
  },

  // ===== ADDITIONAL RESOURCES =====
  '211 Connecticut': {
    nameEs: '211 Connecticut',
    descriptionEs: 'Línea de ayuda gratuita y confidencial que lo conecta con servicios de salud y servicios humanos locales las 24 horas.',
    howToApplyEs: 'Marque 2-1-1 desde cualquier teléfono.'
  },
  'Domestic Violence Hotline - Safe Haven': {
    nameEs: 'Línea de Violencia Doméstica - Safe Haven',
    descriptionEs: 'Línea de ayuda las 24 horas y refugio de emergencia para sobrevivientes de violencia doméstica.',
    howToApplyEs: 'Llame a la línea de ayuda para asistencia inmediata.'
  },
  'VA Connecticut Healthcare': {
    nameEs: 'Atención Médica VA de Connecticut',
    descriptionEs: 'Servicios integrales de atención médica para veteranos elegibles incluyendo atención primaria, salud mental y atención especializada.',
    howToApplyEs: 'Inscríbase en va.gov o llame para verificar elegibilidad.'
  },

  // ===== ADDITIONAL RESOURCES (seed-additional.ts) =====
  'Community Soup Kitchen of Hartford': {
    nameEs: 'Comedor Comunitario de Hartford',
    descriptionEs: 'Comidas gratuitas servidas desde 1977. Almuerzo 5 días/semana, desayuno los sábados. Sin requisitos - abierto a todos.',
    howToApplyEs: 'Preséntese durante las horas de comida. No se requiere identificación ni registro.'
  },
  'Christian Community Action Food Pantry': {
    nameEs: 'Despensa de Alimentos Christian Community Action',
    descriptionEs: 'Despensa de alimentos que proporciona comestibles a familias necesitadas. Sirve a residentes de Hartford.',
    howToApplyEs: 'Traiga identificación y prueba de dirección en Hartford.'
  },
  'Varick AME Zion Church Food Pantry': {
    nameEs: 'Despensa de Alimentos Iglesia AME Zion Varick',
    descriptionEs: 'Despensa de alimentos y comedor que sirve a la comunidad de Dixwell. También proporciona asistencia con ropa.',
    howToApplyEs: 'Traiga identificación con foto y prueba de dirección.'
  },
  'Salvation Army Hartford Food Pantry': {
    nameEs: 'Despensa de Alimentos del Ejército de Salvación Hartford',
    descriptionEs: 'Despensa de alimentos y asistencia de emergencia para familias en crisis.',
    howToApplyEs: 'Preséntese durante las horas con identificación.'
  },
  'St. Ann Food Pantry & Soup Kitchen': {
    nameEs: 'Despensa de Alimentos y Comedor de Santa Ana',
    descriptionEs: 'Despensa de alimentos y comedor que sirve al área metropolitana de Hartford.',
    howToApplyEs: 'Llame para horarios y requisitos.'
  },
  'Macedonia Church Food Pantry': {
    nameEs: 'Despensa de Alimentos Iglesia Macedonia',
    descriptionEs: 'Despensa de alimentos basada en iglesia que sirve a la comunidad de Newhallville.',
    howToApplyEs: 'Llame para horarios y requisitos.'
  },
  'Community Baptist Church Mobile Food Pantry': {
    nameEs: 'Despensa Móvil de Alimentos Iglesia Bautista Comunitaria',
    descriptionEs: 'Distribución mensual de despensa móvil de alimentos.',
    howToApplyEs: 'Preséntese durante el tiempo de distribución.'
  },
  'Youth Continuum - Youth Shelter': {
    nameEs: 'Youth Continuum - Refugio Juvenil',
    descriptionEs: 'Refugio, vivienda y servicios de apoyo para jóvenes sin hogar de 14-24 años. Incluye centro de calentamiento en invierno.',
    howToApplyEs: 'Llame o preséntese. Centro de calentamiento juvenil abierto en enero 2025.'
  },
  'Life Haven - Women & Children Shelter': {
    nameEs: 'Life Haven - Refugio para Mujeres y Niños',
    descriptionEs: 'Refugio de emergencia para mujeres solteras con niños y mujeres embarazadas en su último trimestre.',
    howToApplyEs: 'Llame al 211 para referido o llame directamente.'
  },
  'Hillside Family Shelter': {
    nameEs: 'Refugio Familiar Hillside',
    descriptionEs: 'Vivienda temporal de emergencia para familias con al menos un adulto y un niño. Estadías de 30-60 días.',
    howToApplyEs: 'Llame al 211 para referido a la Red de Acceso Coordinado.'
  },
  'Continuum of Care Emergency Housing': {
    nameEs: 'Vivienda de Emergencia Continuum of Care',
    descriptionEs: 'Vivienda de emergencia que sirve a más de 100 personas sin hogar diariamente. Proporciona comida, refugio y servicios de apoyo.',
    howToApplyEs: 'Preséntese o llame. La mayoría de las estadías son de un par de meses mientras encuentra vivienda.'
  },
  'New Reach - CareWays Shelter': {
    nameEs: 'New Reach - Refugio CareWays',
    descriptionEs: 'Refugio de emergencia para familias con jefa de hogar femenina.',
    howToApplyEs: 'Llame al 211 para evaluación de admisión.'
  },
  'HAVEN Free Clinic': {
    nameEs: 'Clínica Gratuita HAVEN',
    descriptionEs: 'Clínica gratuita de atención primaria administrada por estudiantes para residentes de Hartford sin seguro. Atención integral sin costo.',
    howToApplyEs: 'Debe estar sin seguro y vivir en Hartford. Preséntese los sábados por la mañana.'
  },
  'Hartford Health Department - Health Center': {
    nameEs: 'Departamento de Salud de Hartford - Centro de Salud',
    descriptionEs: 'Servicios de salud accesibles. Cuota de $20 pero nadie es rechazado por incapacidad de pago.',
    howToApplyEs: 'Llame para hacer una cita. Servicios de intérprete disponibles.'
  },
  'Project Access Hartford': {
    nameEs: 'Proyecto Acceso Hartford',
    descriptionEs: 'Conecta a pacientes sin seguro con médicos voluntarios para atención especializada. También ayuda con inscripción en seguros.',
    howToApplyEs: 'Se requiere referido de un proveedor de atención primaria.'
  },
  'MCCA Hartford Outpatient': {
    nameEs: 'MCCA Hartford Ambulatorio',
    descriptionEs: 'Gama completa de tratamiento ambulatorio de adicciones - individual, grupal y ambulatorio intensivo (IOP).',
    howToApplyEs: 'Llame para evaluación de admisión.'
  },
  'SATU - Yale Addiction Treatment': {
    nameEs: 'SATU - Tratamiento de Adicciones Yale',
    descriptionEs: 'Unidad de Tratamiento de Uso de Sustancias y Adicciones que ofrece servicios integrales de adicciones incluyendo MAT.',
    howToApplyEs: 'Llame para programar una evaluación.'
  },
  'CASA Inc - MAAS Day Treatment': {
    nameEs: 'CASA Inc - Tratamiento Diurno MAAS',
    descriptionEs: 'Programa ambulatorio intensivo para adultos con trastornos por uso de sustancias. Servicios en inglés y español.',
    howToApplyEs: 'Llame para admisión.'
  },
  'Grant Street Partnership': {
    nameEs: 'Asociación Grant Street',
    descriptionEs: 'Tratamiento de abuso de sustancias para hombres y mujeres. Vivienda temporal para hombres sin hogar en tratamiento. Comidas y transporte proporcionados.',
    howToApplyEs: 'Llame para admisión.'
  },
  'Crossroads Recovery Center': {
    nameEs: 'Centro de Recuperación Crossroads',
    descriptionEs: 'Ambiente de recuperación seguro y reconfortante para trastornos de adicción y salud mental. Atención culturalmente competente.',
    howToApplyEs: 'Llame para evaluación de admisión.'
  },
  'Workforce Alliance': {
    nameEs: 'Alianza Laboral',
    descriptionEs: 'Asistencia para búsqueda de empleo, ayuda con currículum, coaching de carrera y capacitación laboral. Capacitación gratuita en manufactura en 5 semanas.',
    howToApplyEs: 'Preséntese o regístrese en línea.'
  },
  'American Job Center - Hartford': {
    nameEs: 'Centro de Empleo Americano - Hartford',
    descriptionEs: 'Coaching de carrera, recursos de búsqueda de empleo, información de capacitación y conexiones con empleadores. Centro único de carreras.',
    howToApplyEs: 'Preséntese o llame.'
  },
  'ConnCAT Job Training': {
    nameEs: 'Capacitación Laboral ConnCAT',
    descriptionEs: 'Capacitación laboral gratuita y programas juveniles para residentes de Connecticut. Programas educativos de alta calidad sin costo.',
    howToApplyEs: 'Aplique en línea o llame.'
  },
  'Hartford Works': {
    nameEs: 'Hartford Works',
    descriptionEs: 'Conecta a residentes de Hartford con buenos empleos. Proporciona servicios de capacitación laboral y colocación.',
    howToApplyEs: 'Llame o visite para registrarse.'
  },
  'EMERGE CT - Reentry Employment': {
    nameEs: 'EMERGE CT - Empleo de Reingreso',
    descriptionEs: 'Empleo remunerado a medio tiempo y capacitación en construcción, paisajismo y mantenimiento de propiedades para personas que regresan de la encarcelación.',
    howToApplyEs: 'Llame para admisión. Debe estar en libertad condicional, probatoria o trabajo de liberación.'
  },
  'Connecticut Institute for Refugees and Immigrants': {
    nameEs: 'Instituto de Connecticut para Refugiados e Inmigrantes',
    descriptionEs: 'Servicios legales de inmigración asequibles, preparación para ciudadanía y apoyo para refugiados e inmigrantes desde 1918.',
    howToApplyEs: 'Envíe correo a immigration@cirict.org o llame para cita.'
  },
  'Yale Law School - Immigrant Rights Clinic': {
    nameEs: 'Facultad de Derecho de Yale - Clínica de Derechos de Inmigrantes',
    descriptionEs: 'Servicios legales de inmigración gratuitos para inmigrantes de bajos ingresos. Defensa de deportación, asilo, VAWA, Visas U.',
    howToApplyEs: 'Llame a NHLAA para evaluación de admisión.'
  },
  'Connecticut Energy Assistance Program (CEAP)': {
    nameEs: 'Programa de Asistencia Energética de Connecticut (CEAP)',
    descriptionEs: 'Asistencia de calefacción para hogares de bajos ingresos. Paga aceite, gas, electricidad, propano, queroseno, carbón, madera.',
    howToApplyEs: 'Aplique en línea, por correo a energyapplications@caanh.net, o en 419 Whalley Ave.'
  },
  'Winter Utility Shut-Off Protection': {
    nameEs: 'Protección contra Corte de Servicios en Invierno',
    descriptionEs: 'Protección contra corte de servicios públicos del 1 de noviembre al 1 de mayo para clientes residenciales. Conozca sus derechos.',
    howToApplyEs: 'Si le amenazan con corte durante el invierno, llame a PURA o al 211.'
  },
  'Umbrella Center for Domestic Violence Services': {
    nameEs: 'Centro Umbrella para Servicios de Violencia Doméstica',
    descriptionEs: 'Apoyo de crisis las 24 horas para sobrevivientes de violencia doméstica. Refugio de emergencia, consejería, planificación de seguridad, órdenes de restricción.',
    howToApplyEs: 'Llame a la línea de crisis las 24 horas. Todos los servicios son gratuitos y confidenciales.'
  },
  'CT Safe Connect': {
    nameEs: 'CT Safe Connect',
    descriptionEs: 'Línea de ayuda estatal las 24 horas para apoyo de violencia doméstica. Llame, envíe mensaje de texto o chat. Todos los idiomas soportados.',
    howToApplyEs: 'Llame o envíe texto al (888) 774-2900 o visite CTSafeConnect.org'
  },
  'The Connection - Mental Health Services': {
    nameEs: 'The Connection - Servicios de Salud Mental',
    descriptionEs: 'Servicios comunitarios de salud mental, apoyo de recuperación y vivienda para adultos con enfermedades mentales.',
    howToApplyEs: 'Llame para admisión.'
  },
  'LEAP - Leadership Education Athletics Partnership': {
    nameEs: 'LEAP - Asociación de Liderazgo, Educación y Atletismo',
    descriptionEs: 'Programas gratuitos de verano y después de la escuela para jóvenes de Hartford. Enriquecimiento académico, deportes y liderazgo.',
    howToApplyEs: 'Aplique en línea para programas de verano o después de la escuela.'
  },
  'CT Legal Services - Hartford': {
    nameEs: 'Servicios Legales de CT - Hartford',
    descriptionEs: 'Ayuda legal civil gratuita para residentes de bajos ingresos. Vivienda, familia, beneficios, inmigración para sobrevivientes de VD.',
    howToApplyEs: 'Llame a la línea de admisión para aplicar.'
  },

  // ===== CHURCH RESOURCES (seed-churches.ts) =====
  'Loaves and Fishes - St. Paul & St. James Church': {
    nameEs: 'Panes y Peces - Iglesia St. Paul & St. James',
    descriptionEs: 'Despensa de alimentos y armario de ropa desde 1982. Proporciona alimentos, ropa y artículos de cuidado personal a cualquier persona necesitada.',
    howToApplyEs: 'Preséntese durante las horas de distribución.'
  },
  'Immanuel Baptist Church Clothes Closet': {
    nameEs: 'Armario de Ropa Iglesia Bautista Immanuel',
    descriptionEs: 'Armario de ropa gratuita abierto a la comunidad. También se aceptan donaciones.',
    howToApplyEs: 'Preséntese durante las horas.'
  },
  'Bethel AME Church Food Pantry': {
    nameEs: 'Despensa de Alimentos Iglesia AME Bethel',
    descriptionEs: 'Despensa de alimentos basada en iglesia que sirve a la comunidad de Dixwell/Newhallville. Parte de la misión histórica AME de servir a los necesitados.',
    howToApplyEs: 'Preséntese durante las horas de distribución.'
  },
  'Moved With Compassion Ministry': {
    nameEs: 'Ministerio Movidos con Compasión',
    descriptionEs: 'Organización sin fines de lucro que proporciona alimentos, agua, ropa y abrigos de invierno a personas sin hogar. También proporciona asistencia educativa y espiritual.',
    howToApplyEs: 'Contacte a través del sitio web para horario de distribución.'
  },
  'Mount Hope Temple Food Pantry': {
    nameEs: 'Despensa de Alimentos Templo Monte Hope',
    descriptionEs: 'Despensa de alimentos basada en iglesia que sirve a la comunidad de Dixwell Avenue.',
    howToApplyEs: 'Llame para horarios y requisitos.'
  },
  'Pitts Chapel Baptist Church Food Pantry': {
    nameEs: 'Despensa de Alimentos Iglesia Bautista Pitts Chapel',
    descriptionEs: 'Despensa de alimentos de iglesia que sirve a la comunidad de Hartford.',
    howToApplyEs: 'Llame para horario de distribución.'
  },
  "St. Luke's Services Food Pantry": {
    nameEs: 'Despensa de Alimentos Servicios de St. Luke',
    descriptionEs: 'Despensa de alimentos y servicios comunitarios en Whalley Avenue.',
    howToApplyEs: 'Llame para horarios.'
  },
  "St. Matthew's Unison Freewill Baptist Food Pantry": {
    nameEs: "Despensa de Alimentos Iglesia Bautista St. Matthew's",
    descriptionEs: 'Despensa de alimentos basada en iglesia en Dixwell Avenue.',
    howToApplyEs: 'Llame para horario de distribución.'
  },
  'Omega SDA Church Community Service': {
    nameEs: 'Servicio Comunitario Iglesia ASD Omega',
    descriptionEs: 'Distribución mensual de alimentos que sirve a la comunidad de Hartford.',
    howToApplyEs: 'Preséntese durante las horas de distribución.'
  },
  'Christian Community Action': {
    nameEs: 'Acción Comunitaria Cristiana',
    descriptionEs: 'Organización sin fines de lucro basada en la fe desde 1967 que proporciona despensa de alimentos, asistencia de vivienda y manejo de casos. El programa NEW HOPE ofrece apartamentos amueblados por hasta 36 meses.',
    howToApplyEs: 'Llame o visite para admisión.'
  },
  'Beulah Heights Social Integration Program': {
    nameEs: 'Programa de Integración Social Beulah Heights',
    descriptionEs: 'Servicios integrales para personas sin hogar y personas que regresan de la encarcelación. Centro de calentamiento, comidas, centro de recursos y transporte en van.',
    howToApplyEs: 'Preséntese el sábado o llame para otros servicios.'
  },
  'Dixwell Avenue Congregational UCC': {
    nameEs: 'Iglesia Congregacional UCC de Dixwell Avenue',
    descriptionEs: 'La iglesia congregacional afroamericana más antigua del mundo (fundada en 1820). Alcance comunitario y conexión histórica con los vecindarios Dixwell/Newhallville.',
    howToApplyEs: 'Llame para información sobre programas comunitarios.'
  },
  'Chapel on the Green': {
    nameEs: 'Capilla en el Green',
    descriptionEs: 'Servicio de adoración al aire libre y comida gratuita para personas sin hogar y miembros vulnerables de la comunidad. Círculo de tambores, Eucaristía, oraciones de sanación y compañerismo.',
    howToApplyEs: 'Preséntese. Todos son bienvenidos.'
  },
  'The Spiritual Fellowship': {
    nameEs: 'La Comunidad Espiritual',
    descriptionEs: 'Comunidad de apoyo para personas que luchan con adicción, enfermedades mentales y falta de vivienda. Incluye comida y compañerismo.',
    howToApplyEs: 'Preséntese. Todos son bienvenidos.'
  },
  'Trinity Community Grants Program': {
    nameEs: 'Programa de Subvenciones Comunitarias Trinity',
    descriptionEs: 'Financiamiento de subvenciones para programas de servicios humanos que abordan salud, hambre, refugio y educación en Hartford.',
    howToApplyEs: 'Contacte la iglesia para el proceso de solicitud de subvención.'
  },
  'First Calvary Baptist Church': {
    nameEs: 'Primera Iglesia Bautista Calvary',
    descriptionEs: 'Iglesia histórica negra en Newhallville que proporciona alcance comunitario y servicios de apoyo.',
    howToApplyEs: 'Llame para información sobre programas comunitarios.'
  },
  'St. Vincent de Paul Society - Hartford': {
    nameEs: 'Sociedad de San Vicente de Paúl - Hartford',
    descriptionEs: 'Caridad católica que proporciona asistencia financiera de emergencia para alquiler, servicios públicos, alimentos y otras necesidades básicas a través de visitas domiciliarias.',
    howToApplyEs: 'Contacte la parroquia católica local para referido a su conferencia del vecindario.'
  },
  'St. Rose of Lima Church - Food Pantry': {
    nameEs: 'Iglesia Santa Rosa de Lima - Despensa de Alimentos',
    descriptionEs: 'Despensa de alimentos de iglesia católica que sirve a la comunidad de Fair Haven.',
    howToApplyEs: 'Llame para horario de distribución.'
  },
  'St. Francis Church & St. Rose of Lima - ESL Classes': {
    nameEs: 'Iglesia San Francisco y Santa Rosa de Lima - Clases de ESL',
    descriptionEs: 'Clases gratuitas de inglés como segundo idioma para inmigrantes y refugiados.',
    howToApplyEs: 'Llame para registrarse en las clases.'
  },
  'Jewish Family Service of Greater Hartford': {
    nameEs: 'Servicio Familiar Judío del Gran Hartford',
    descriptionEs: 'Consejería, servicios para personas mayores, reasentamiento de refugiados y asistencia de emergencia. Sirve a todas las religiones.',
    howToApplyEs: 'Llame para admisión.'
  },
  'Masjid Al-Islam Food Pantry': {
    nameEs: 'Despensa de Alimentos Masjid Al-Islam',
    descriptionEs: 'Centro comunitario islámico que proporciona asistencia alimentaria a familias necesitadas.',
    howToApplyEs: 'Llame para horario de distribución.'
  },
  'Mercy Center': {
    nameEs: 'Centro de Misericordia',
    descriptionEs: 'Centro de retiro espiritual que da la bienvenida a todas las religiones. Ofrece programas de renovación personal, referidos de consejería y apoyo comunitario.',
    howToApplyEs: 'Llame o visite el sitio web para horario de programas.'
  },
}

async function main() {
  console.log('Adding Spanish translations to all resources...')

  let updated = 0
  let notFound = 0
  let alreadyDone = 0

  for (const [name, trans] of Object.entries(translations)) {
    const resource = await prisma.resource.findFirst({
      where: { name }
    })

    if (!resource) {
      console.log(`Not found: ${name}`)
      notFound++
      continue
    }

    // Update if missing nameEs or descriptionEs
    if (resource.nameEs && resource.descriptionEs) {
      alreadyDone++
      continue
    }

    await prisma.resource.update({
      where: { id: resource.id },
      data: {
        nameEs: trans.nameEs,
        descriptionEs: trans.descriptionEs,
        howToApplyEs: trans.howToApplyEs || resource.howToApplyEs
      }
    })

    console.log(`Updated: ${name}`)
    updated++
  }

  console.log(`\nDone! Updated: ${updated}, Already done: ${alreadyDone}, Not found: ${notFound}`)

  // Check remaining
  const remaining = await prisma.resource.count({ where: { OR: [{ nameEs: null }, { descriptionEs: null }] } })
  console.log(`Resources still missing translations: ${remaining}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
