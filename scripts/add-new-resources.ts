import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const newResources = [
  // SENIOR SERVICES
  {
    name: 'Hartford Elderly Services',
    nameEs: 'Servicios para Personas Mayores de Hartford',
    organization: 'City of Hartford',
    description: 'City department providing resources and support for residents age 60+. Services include senior center programs, meal delivery, social activities, benefits counseling, and connections to community resources. The department advocates for older adults and works to ensure equal access to city services.',
    descriptionEs: 'Departamento de la ciudad que proporciona recursos y apoyo para residentes de 60 años o más. Los servicios incluyen programas de centros para personas mayores, entrega de comidas, actividades sociales, asesoramiento sobre beneficios y conexiones con recursos comunitarios.',
    categories: ['healthcare'],
    address: '165 Church Street',
    city: 'Hartford',
    state: 'CT',
    zip: '06510',
    phone: '203-946-8041',
    website: 'https://www.newhavenct.gov/city-services/elderly-services',
    eligibility: { minAge: 60 },
    howToApply: 'Call or visit the office to learn about available programs and services.',
    howToApplyEs: 'Llame o visite la oficina para conocer los programas y servicios disponibles.',
    tips: [
      'Ask about the Elderly Nutrition Program for free or low-cost meals',
      'They can help with Renters Rebate applications for seniors',
      'Medicare counseling is available through their office'
    ],
    tipsEs: [
      'Pregunte sobre el Programa de Nutrición para Personas Mayores',
      'Pueden ayudar con solicitudes de Reembolso de Alquiler para personas mayores',
      'Asesoramiento de Medicare está disponible en su oficina'
    ]
  },
  {
    name: 'Agency on Aging of South Central CT',
    nameEs: 'Agencia sobre el Envejecimiento del Centro Sur de CT',
    organization: 'AOASCC',
    description: 'Non-profit serving older adults, individuals with disabilities, and caregivers in greater Hartford. Provides information, referrals, and direct services including Medicare counseling, caregiver support, long-term care planning, and connections to home-based services.',
    descriptionEs: 'Organización sin fines de lucro que sirve a adultos mayores, personas con discapacidades y cuidadores en el área de Hartford. Proporciona información, referencias y servicios directos incluyendo asesoramiento de Medicare y apoyo a cuidadores.',
    categories: ['healthcare'],
    address: '1 Long Wharf Drive, Suite 312',
    city: 'Hartford',
    state: 'CT',
    zip: '06511',
    phone: '203-785-8533',
    website: 'https://www.aoascc.org',
    eligibility: { minAge: 60 },
    howToApply: 'Call the main line to be connected with an aging specialist.',
    howToApplyEs: 'Llame a la línea principal para conectarse con un especialista en envejecimiento.',
    tips: [
      'Ask about the medical chaperone program for help with medical appointments',
      'They offer CHOICES Medicare counseling completely free',
      'Caregiver support groups and respite services are available'
    ],
    tipsEs: [
      'Pregunte sobre el programa de acompañante médico',
      'Ofrecen asesoramiento de Medicare CHOICES completamente gratis',
      'Grupos de apoyo para cuidadores están disponibles'
    ]
  },
  {
    name: 'Mary Wade Senior Medical Transportation',
    nameEs: 'Transporte Médico para Personas Mayores Mary Wade',
    organization: 'Mary Wade',
    description: 'Free medical transportation for low-income seniors who cannot afford taxis or public transit and are ineligible for Medicaid transportation. Provides rides to medical and dental appointments.',
    descriptionEs: 'Transporte médico gratuito para personas mayores de bajos ingresos que no pueden pagar taxis o transporte público y no son elegibles para transporte de Medicaid.',
    categories: ['transportation', 'healthcare'],
    address: '118 Clinton Avenue',
    city: 'Hartford',
    state: 'CT',
    zip: '06513',
    phone: '203-562-7222',
    website: 'https://www.marywade.org',
    eligibility: { minAge: 60, incomeRestricted: true },
    howToApply: 'Call to schedule rides at least 48 hours in advance.',
    howToApplyEs: 'Llame para programar viajes con al menos 48 horas de anticipación.',
    tips: [
      'Call early - rides fill up quickly',
      'They serve greater Hartford area medical facilities',
      'Must be income-qualified and not eligible for VEYO/Medicaid transport'
    ],
    tipsEs: [
      'Llame temprano - los viajes se llenan rápidamente',
      'Sirven instalaciones médicas del área de Hartford',
      'Debe calificar por ingresos y no ser elegible para transporte VEYO/Medicaid'
    ]
  },

  // YOUTH SERVICES
  {
    name: 'Q House Youth Programs',
    nameEs: 'Programas Juveniles Q House',
    organization: 'Dixwell Community House',
    description: 'FREE classes and workshops for youth and adults including ceramics, art, music production, yoga, dance, and more. Also offers GED classes, computer training, and after-school programs. A community hub for Dixwell neighborhood.',
    descriptionEs: 'Clases y talleres GRATUITOS para jóvenes y adultos incluyendo cerámica, arte, producción musical, yoga, baile y más. También ofrece clases de GED, capacitación en computadoras y programas después de la escuela.',
    categories: ['childcare', 'employment'],
    address: '197 Dixwell Avenue',
    city: 'Hartford',
    state: 'CT',
    zip: '06511',
    phone: '475-306-6936',
    website: 'https://www.qhouse.org',
    eligibility: {},
    howToApply: 'Walk in or call to register for programs. Most are free and open to the community.',
    howToApplyEs: 'Presente sin cita o llame para registrarse. La mayoría son gratis y abiertos a la comunidad.',
    tips: [
      'Check their social media for current class schedules',
      'Youth programs run after school and during summer',
      'GED classes are offered in partnership with Hartford Adult Ed'
    ],
    tipsEs: [
      'Revise sus redes sociales para horarios de clases actuales',
      'Los programas juveniles funcionan después de la escuela y durante el verano',
      'Las clases de GED se ofrecen en asociación con Educación de Adultos'
    ]
  },
  {
    name: 'Youth@Work Summer Program',
    nameEs: 'Programa de Verano Youth@Work',
    organization: 'City of Hartford',
    description: 'Summer work-based learning program providing Hartford Public School students ages 14-21 with paid workplace experience, mentoring, and enrichment activities. Typically runs July through August.',
    descriptionEs: 'Programa de aprendizaje basado en el trabajo de verano que proporciona a estudiantes de las Escuelas Públicas de Hartford de 14-21 años experiencia laboral pagada, mentoría y actividades de enriquecimiento.',
    categories: ['employment', 'childcare'],
    address: '200 Orange Street',
    city: 'Hartford',
    state: 'CT',
    zip: '06510',
    phone: '203-946-7582',
    website: 'https://www.newhavenct.gov/government/departments-divisions/youth-and-recreation-department/programs-initiatives/youth-work',
    eligibility: { minAge: 14, maxAge: 21 },
    howToApply: 'Applications open in spring each year. Must be enrolled in Hartford Public Schools.',
    howToApplyEs: 'Las solicitudes abren en primavera cada año. Debe estar inscrito en las Escuelas Públicas de Hartford.',
    tips: [
      'Apply early - spots fill quickly each spring',
      'Program includes job readiness training before placement',
      'Youth earn minimum wage for their work experience'
    ],
    tipsEs: [
      'Solicite temprano - los lugares se llenan rápidamente cada primavera',
      'El programa incluye capacitación antes de la colocación',
      'Los jóvenes ganan salario mínimo por su experiencia laboral'
    ]
  },
  {
    name: 'Youth Connect',
    nameEs: 'Youth Connect',
    organization: 'City of Hartford',
    description: 'School-based intervention program that identifies at-risk youth and connects them to a network of services including mental health support, academic assistance, mentoring, and community resources to reduce justice involvement.',
    descriptionEs: 'Programa de intervención escolar que identifica a jóvenes en riesgo y los conecta con una red de servicios incluyendo apoyo de salud mental, asistencia académica, mentoría y recursos comunitarios.',
    categories: ['mental-health', 'childcare'],
    address: '200 Orange Street',
    city: 'Hartford',
    state: 'CT',
    zip: '06510',
    phone: '203-946-7582',
    website: 'https://www.newhavenct.gov/government/departments-divisions/youth-and-recreation-department/programs-initiatives/youth-connect',
    eligibility: { populations: ['youth'] },
    howToApply: 'Referrals come through Hartford schools. Parents can also contact the Youth Services Bureau.',
    howToApplyEs: 'Las referencias vienen a través de las escuelas de Hartford. Los padres también pueden contactar la Oficina de Servicios Juveniles.',
    tips: [
      'Ask your school counselor about Youth Connect services',
      'Services are confidential and free',
      'They can connect youth with mental health and employment resources'
    ],
    tipsEs: [
      'Pregunte a su consejero escolar sobre los servicios de Youth Connect',
      'Los servicios son confidenciales y gratuitos',
      'Pueden conectar a los jóvenes con recursos de salud mental y empleo'
    ]
  },
  {
    name: 'Hartford Free Public Library - Teen Center',
    nameEs: 'Biblioteca Pública de Hartford - Centro para Adolescentes',
    organization: 'Hartford Free Public Library',
    description: 'Free teen space for youth grades 7-12 (ages 13-19) at Ives Main Library. Offers computers, Smart TVs, games, crafts, and programs focusing on wellness, technology, arts, and culture. Open after school and Saturday afternoons.',
    descriptionEs: 'Espacio gratuito para adolescentes de grados 7-12 (edades 13-19) en la Biblioteca Principal Ives. Ofrece computadoras, Smart TVs, juegos, manualidades y programas enfocados en bienestar, tecnología, artes y cultura.',
    categories: ['childcare'],
    address: '133 Elm Street',
    city: 'Hartford',
    state: 'CT',
    zip: '06510',
    phone: '203-946-8130',
    website: 'https://nhfpl.org/teen-home/',
    eligibility: { minAge: 13, maxAge: 19 },
    howToApply: 'Just show up! No registration required. Get a free library card for full access.',
    howToApplyEs: '¡Solo preséntese! No se requiere registro. Obtenga una tarjeta de biblioteca gratis para acceso completo.',
    tips: [
      'Located on the lower level of Ives Main Library',
      'Free wifi and computer access',
      'Check their calendar for special programs and events'
    ],
    tipsEs: [
      'Ubicado en el nivel inferior de la Biblioteca Principal Ives',
      'Wifi gratuito y acceso a computadoras',
      'Revise su calendario para programas y eventos especiales'
    ]
  },
  {
    name: 'Elm City Internationals',
    nameEs: 'Elm City Internationals',
    organization: 'Elm City Internationals',
    description: 'Year-round program for immigrant and refugee middle and high school students. Provides academic support, college preparation, cultural enrichment, and summer programming. Free Summer Academy runs Monday-Friday.',
    descriptionEs: 'Programa durante todo el año para estudiantes inmigrantes y refugiados de escuela media y secundaria. Proporciona apoyo académico, preparación universitaria, enriquecimiento cultural y programación de verano.',
    categories: ['childcare', 'immigration'],
    address: '37 Howe Street',
    city: 'Hartford',
    state: 'CT',
    zip: '06511',
    phone: '203-671-3802',
    website: 'https://www.elmcityinternationals.org',
    eligibility: { populations: ['immigrant'] },
    howToApply: 'Apply online or contact the program. Students join in middle school and stay through high school graduation.',
    howToApplyEs: 'Solicite en línea o contacte el programa. Los estudiantes se unen en la escuela media y permanecen hasta la graduación de secundaria.',
    tips: [
      'Free summer academy runs 8am-4pm weekdays',
      'Transportation may be available',
      'College counseling and scholarship support included'
    ],
    tipsEs: [
      'La academia de verano gratuita funciona de 8am-4pm entre semana',
      'El transporte puede estar disponible',
      'Se incluye asesoramiento universitario y apoyo para becas'
    ]
  },

  // LEGAL/IMMIGRATION
  {
    name: 'Jerome N. Frank Legal Services - Yale Law',
    nameEs: 'Servicios Legales Jerome N. Frank - Yale Law',
    organization: 'Yale Law School',
    description: 'Free legal services provided by Yale Law students under attorney supervision. Handles immigration cases including asylum, deportation defense, adjustment of status, and more. Also assists with other civil legal matters.',
    descriptionEs: 'Servicios legales gratuitos proporcionados por estudiantes de Derecho de Yale bajo supervisión de abogados. Maneja casos de inmigración incluyendo asilo, defensa de deportación, ajuste de estatus y más.',
    categories: ['legal', 'immigration'],
    address: 'P.O. Box 209090',
    city: 'Hartford',
    state: 'CT',
    zip: '06520',
    phone: '203-432-4800',
    website: 'https://law.yale.edu/studying-law-yale/clinical-and-experiential-learning/our-clinics',
    eligibility: { incomeRestricted: true },
    howToApply: 'Call to inquire about intake. Cases are selected based on educational value and client need.',
    howToApplyEs: 'Llame para consultar sobre admisión. Los casos se seleccionan según el valor educativo y la necesidad del cliente.',
    tips: [
      'They handle complex immigration cases that other clinics may not take',
      'Wait times can be long - apply early if possible',
      'Bring all immigration documents to your first meeting'
    ],
    tipsEs: [
      'Manejan casos de inmigración complejos que otras clínicas pueden no tomar',
      'Los tiempos de espera pueden ser largos - solicite temprano si es posible',
      'Traiga todos los documentos de inmigración a su primera reunión'
    ]
  },
  {
    name: 'Connecticut Free Legal Answers',
    nameEs: 'Respuestas Legales Gratuitas de Connecticut',
    organization: 'Connecticut Bar Association',
    description: 'Free online legal advice from volunteer attorneys. Submit civil legal questions online and receive written responses. Cannot help with criminal cases but covers family law, housing, consumer issues, and more.',
    descriptionEs: 'Asesoramiento legal gratuito en línea de abogados voluntarios. Envíe preguntas legales civiles en línea y reciba respuestas escritas. No puede ayudar con casos criminales pero cubre derecho familiar, vivienda, problemas del consumidor y más.',
    categories: ['legal'],
    address: 'Online Service',
    city: 'Hartford',
    state: 'CT',
    zip: '06510',
    phone: '877-410-7221',
    website: 'https://ctfreelegalanswers.org',
    eligibility: { incomeRestricted: true },
    howToApply: 'Create an account at ctfreelegalanswers.org and submit your question.',
    howToApplyEs: 'Cree una cuenta en ctfreelegalanswers.org y envíe su pregunta.',
    tips: [
      'Be specific and detailed in your question for better answers',
      'This is for legal advice only - they cannot represent you in court',
      'Response times vary - typically within a few days'
    ],
    tipsEs: [
      'Sea específico y detallado en su pregunta para mejores respuestas',
      'Esto es solo para asesoramiento legal - no pueden representarlo en la corte',
      'Los tiempos de respuesta varían - típicamente dentro de unos días'
    ]
  },

  // DISABILITY SERVICES
  {
    name: 'Disability Rights Connecticut',
    nameEs: 'Derechos de Discapacidad de Connecticut',
    organization: 'DRCT',
    description: 'Free legal advocacy for people with disabilities. Helps with discrimination, abuse/neglect, access to services, education rights, employment issues, and benefits. Provides information, advice, and legal representation.',
    descriptionEs: 'Defensa legal gratuita para personas con discapacidades. Ayuda con discriminación, abuso/negligencia, acceso a servicios, derechos educativos, problemas de empleo y beneficios.',
    categories: ['legal', 'employment'],
    address: '846 Wethersfield Avenue',
    city: 'Hartford',
    state: 'CT',
    zip: '06114',
    phone: '800-842-7303',
    website: 'https://www.disrightsct.org',
    eligibility: { populations: ['disability'] },
    howToApply: 'Call the intake line to discuss your situation and see if they can help.',
    howToApplyEs: 'Llame a la línea de admisión para discutir su situación y ver si pueden ayudar.',
    tips: [
      'They can help if an employer or landlord discriminated against you due to disability',
      'TTY available for deaf/hard of hearing',
      'Can help with SSI/SSDI denials through the PABSS program'
    ],
    tipsEs: [
      'Pueden ayudar si un empleador o propietario lo discriminó debido a su discapacidad',
      'TTY disponible para personas sordas/con dificultades auditivas',
      'Pueden ayudar con denegaciones de SSI/SSDI a través del programa PABSS'
    ]
  },
  {
    name: 'SOAR - SSI/SSDI Application Assistance',
    nameEs: 'SOAR - Asistencia para Solicitudes de SSI/SSDI',
    organization: 'Liberty Community Services',
    description: 'Free help applying for SSI/SSDI disability benefits, especially for people who are homeless or at risk of homelessness. SOAR-trained specialists guide you through the complex application process.',
    descriptionEs: 'Ayuda gratuita para solicitar beneficios de discapacidad SSI/SSDI, especialmente para personas sin hogar o en riesgo de quedarse sin hogar. Especialistas entrenados en SOAR lo guían a través del complejo proceso de solicitud.',
    categories: ['cash', 'housing'],
    address: '235 Grand Avenue',
    city: 'Hartford',
    state: 'CT',
    zip: '06513',
    phone: '475-414-6352',
    website: 'https://soarworks.samhsa.gov/states/connecticut',
    eligibility: { populations: ['homeless', 'disability'] },
    howToApply: 'Contact Liberty Community Services or Columbus House and ask about SOAR assistance.',
    howToApplyEs: 'Contacte a Liberty Community Services o Columbus House y pregunte sobre asistencia SOAR.',
    tips: [
      'SOAR applications are approved faster than regular applications',
      'Gather medical records if you have them - SOAR staff can help obtain them',
      'Be patient - even expedited applications take several months'
    ],
    tipsEs: [
      'Las solicitudes SOAR se aprueban más rápido que las solicitudes regulares',
      'Reúna registros médicos si los tiene - el personal de SOAR puede ayudar a obtenerlos',
      'Sea paciente - incluso las solicitudes expeditas toman varios meses'
    ]
  },
  {
    name: 'Hartford Disability Services',
    nameEs: 'Servicios de Discapacidad de Hartford',
    organization: 'City of Hartford',
    description: 'City department ensuring equal access to city programs and services for residents with disabilities. Provides information, advocacy, and helps resolve accessibility issues with city facilities and programs.',
    descriptionEs: 'Departamento de la ciudad que asegura acceso igual a programas y servicios de la ciudad para residentes con discapacidades. Proporciona información, defensa y ayuda a resolver problemas de accesibilidad.',
    categories: ['legal'],
    address: '165 Church Street',
    city: 'Hartford',
    state: 'CT',
    zip: '06510',
    phone: '203-946-8523',
    website: 'https://www.newhavenct.gov/government/departments-divisions/disability-services',
    eligibility: { populations: ['disability'] },
    howToApply: 'Call or email the ADA Coordinator with questions or concerns.',
    howToApplyEs: 'Llame o envíe un correo electrónico al Coordinador de ADA con preguntas o inquietudes.',
    tips: [
      'Contact them if you face barriers accessing city services',
      'They can help with ADA accommodation requests',
      'Connects residents with community disability resources'
    ],
    tipsEs: [
      'Contáctelos si enfrenta barreras para acceder a servicios de la ciudad',
      'Pueden ayudar con solicitudes de acomodación ADA',
      'Conecta a residentes con recursos comunitarios de discapacidad'
    ]
  },

  // DENTAL
  {
    name: 'CT Mission of Mercy Free Dental Clinic',
    nameEs: 'Clínica Dental Gratuita CT Mission of Mercy',
    organization: 'Connecticut Foundation for Dental Outreach',
    description: 'Annual two-day free dental clinic providing cleanings, fillings, extractions, and limited root canals to underserved and uninsured CT residents. No appointment needed - first come, first served.',
    descriptionEs: 'Clínica dental gratuita anual de dos días que proporciona limpiezas, empastes, extracciones y tratamientos de conducto limitados a residentes de CT desatendidos y sin seguro. No se necesita cita - primero en llegar, primero en ser atendido.',
    categories: ['healthcare'],
    address: 'Rotating locations - check website',
    city: 'Hartford',
    state: 'CT',
    zip: '06510',
    phone: '860-378-7100',
    website: 'https://cfdo.org/ct-mom/',
    eligibility: {},
    howToApply: 'Show up early on clinic days. Check website for annual location and dates.',
    howToApplyEs: 'Llegue temprano en los días de clínica. Revise el sitio web para ubicación y fechas anuales.',
    tips: [
      'Doors open at 7am but people line up much earlier',
      'Bring photo ID and proof of income if you have them',
      'Children under 18 must have parent/guardian present'
    ],
    tipsEs: [
      'Las puertas abren a las 7am pero la gente hace fila mucho antes',
      'Traiga identificación con foto y prueba de ingresos si los tiene',
      'Menores de 18 años deben tener padre/tutor presente'
    ]
  },
  {
    name: 'CT Dental Health Partnership',
    nameEs: 'Asociación de Salud Dental de CT',
    organization: 'CTDHP',
    description: 'Helps people with HUSKY (Medicaid) find dentists, schedule appointments, and understand their dental benefits. Can connect you with dentists who accept Medicaid in your area.',
    descriptionEs: 'Ayuda a personas con HUSKY (Medicaid) a encontrar dentistas, programar citas y entender sus beneficios dentales. Puede conectarlo con dentistas que aceptan Medicaid en su área.',
    categories: ['healthcare'],
    address: 'Phone Service',
    city: 'Hartford',
    state: 'CT',
    zip: '06510',
    phone: '866-420-2924',
    website: 'https://www.ctdhp.com',
    eligibility: { insuranceStatus: ['medicaid'] },
    howToApply: 'Call the toll-free number. They can help find a dentist and schedule your first appointment.',
    howToApplyEs: 'Llame al número gratuito. Pueden ayudar a encontrar un dentista y programar su primera cita.',
    tips: [
      'Have your HUSKY member ID ready when you call',
      'They can help with transportation to appointments',
      'Ask about the full range of dental services covered by your plan'
    ],
    tipsEs: [
      'Tenga su ID de miembro HUSKY listo cuando llame',
      'Pueden ayudar con transporte a citas',
      'Pregunte sobre la gama completa de servicios dentales cubiertos por su plan'
    ]
  },

  // EDUCATION
  {
    name: 'Hartford Adult & Continuing Education',
    nameEs: 'Educación de Adultos y Continua de Hartford',
    organization: 'Hartford Public Schools',
    description: 'Free GED preparation classes, English as a Second Language (ESL), citizenship preparation, computer skills, and workforce training. GED testing site. Open to adults 16+ who are not enrolled in high school.',
    descriptionEs: 'Clases gratuitas de preparación para GED, inglés como segundo idioma (ESL), preparación para ciudadanía, habilidades de computación y capacitación laboral. Sitio de examen GED. Abierto a adultos de 16+ que no están inscritos en la secundaria.',
    categories: ['employment', 'immigration'],
    address: '580 Ella T. Grasso Boulevard',
    city: 'Hartford',
    state: 'CT',
    zip: '06519',
    phone: '203-492-0213',
    website: 'https://www.nhaec.org',
    eligibility: { minAge: 16 },
    howToApply: 'Walk in or call during office hours (Mon-Fri 7:30am-1:30pm) to register for classes.',
    howToApplyEs: 'Presente sin cita o llame durante horas de oficina (Lun-Vie 7:30am-1:30pm) para registrarse.',
    tips: [
      'GED exam is FREE for CT residents under 21 and veterans',
      'ESL classes are offered at multiple levels',
      'They also offer workforce training in healthcare and other fields'
    ],
    tipsEs: [
      'El examen de GED es GRATIS para residentes de CT menores de 21 años y veteranos',
      'Las clases de ESL se ofrecen en múltiples niveles',
      'También ofrecen capacitación laboral en salud y otros campos'
    ]
  },
  {
    name: 'Hartford Job Corps Center',
    nameEs: 'Centro Job Corps de Hartford',
    organization: 'Job Corps',
    description: 'Free residential education and job training program for young adults ages 16-24. Provides GED/high school diploma, career training, housing, meals, basic health care, and job placement assistance.',
    descriptionEs: 'Programa gratuito residencial de educación y capacitación laboral para adultos jóvenes de 16-24 años. Proporciona GED/diploma de secundaria, capacitación profesional, vivienda, comidas, atención médica básica y asistencia de colocación laboral.',
    categories: ['employment', 'housing', 'healthcare'],
    address: '455 Wintergreen Avenue',
    city: 'Hartford',
    state: 'CT',
    zip: '06515',
    phone: '203-397-3775',
    website: 'https://newhaven.jobcorps.gov',
    eligibility: { minAge: 16, maxAge: 24, incomeRestricted: true },
    howToApply: 'Call to schedule an admissions appointment or apply online at jobcorps.gov.',
    howToApplyEs: 'Llame para programar una cita de admisión o solicite en línea en jobcorps.gov.',
    tips: [
      'Program is completely free including room and board',
      'Career tracks include healthcare, construction, IT, and more',
      'Youth receive a bi-weekly living allowance while enrolled'
    ],
    tipsEs: [
      'El programa es completamente gratis incluyendo alojamiento y comida',
      'Las carreras incluyen salud, construcción, TI y más',
      'Los jóvenes reciben una asignación quincenal mientras están inscritos'
    ]
  },

  // EMPLOYMENT
  {
    name: 'CT Older Worker Training Program',
    nameEs: 'Programa de Capacitación para Trabajadores Mayores de CT',
    organization: 'A4TD',
    description: 'Free virtual job skills training for low-income Hartford County residents age 55+. Focuses on high-demand jobs in food service and healthcare. Provides laptops and internet access to participants.',
    descriptionEs: 'Capacitación gratuita virtual de habilidades laborales para residentes de bajos ingresos del Condado de Hartford de 55+ años. Se enfoca en trabajos de alta demanda en servicio de alimentos y atención médica.',
    categories: ['employment'],
    address: 'Virtual Program',
    city: 'Hartford',
    state: 'CT',
    zip: '06510',
    phone: '833-428-2422',
    website: 'https://a4td.org/ctworkers/',
    eligibility: { minAge: 55, incomeRestricted: true },
    howToApply: 'Apply online at a4td.org/ctworkers or call the toll-free number.',
    howToApplyEs: 'Solicite en línea en a4td.org/ctworkers o llame al número gratuito.',
    tips: [
      'No computer? They provide laptops and internet hotspots',
      'Training is self-paced and done entirely online',
      'Focus on entry-level positions with room for growth'
    ],
    tipsEs: [
      '¿Sin computadora? Proporcionan laptops y puntos de acceso a internet',
      'La capacitación es a su propio ritmo y completamente en línea',
      'Enfoque en posiciones de nivel de entrada con espacio para crecer'
    ]
  },
  {
    name: 'CT State Community College - Workforce Training',
    nameEs: 'CT State Community College - Capacitación Laboral',
    organization: 'CT State Community College',
    description: 'Affordable career training and workforce development programs in healthcare, manufacturing, IT, and more. Some programs are free for eligible participants through workforce scholarships.',
    descriptionEs: 'Programas asequibles de capacitación profesional y desarrollo laboral en salud, manufactura, TI y más. Algunos programas son gratuitos para participantes elegibles a través de becas laborales.',
    categories: ['employment'],
    address: '20 Church Street',
    city: 'Hartford',
    state: 'CT',
    zip: '06510',
    phone: '203-285-2300',
    website: 'https://ctstate.edu/workforce-development/wdce',
    eligibility: {},
    howToApply: 'Contact the Workforce Development office for program information and registration.',
    howToApplyEs: 'Contacte la oficina de Desarrollo Laboral para información sobre programas y registro.',
    tips: [
      'Ask about training scholarships through Workforce Alliance',
      'Some programs lead to industry-recognized certifications',
      'Evening and weekend classes available for working adults'
    ],
    tipsEs: [
      'Pregunte sobre becas de capacitación a través de Workforce Alliance',
      'Algunos programas conducen a certificaciones reconocidas por la industria',
      'Clases nocturnas y de fin de semana disponibles para adultos trabajadores'
    ]
  },

  // ADDITIONAL HEALTHCARE
  {
    name: 'CHERISH Elder Abuse Prevention',
    nameEs: 'Prevención de Abuso de Personas Mayores CHERISH',
    organization: 'Agency on Aging of South Central CT',
    description: 'Domestic violence services tailored for elderly victims including counseling, safety planning, and safe shelter at assisted living facilities. Confidential support for seniors experiencing abuse.',
    descriptionEs: 'Servicios de violencia doméstica adaptados para víctimas mayores incluyendo consejería, planificación de seguridad y refugio seguro en instalaciones de vida asistida.',
    categories: ['housing', 'mental-health', 'legal'],
    address: '1 Long Wharf Drive, Suite 312',
    city: 'Hartford',
    state: 'CT',
    zip: '06511',
    phone: '203-785-8533',
    website: 'https://www.aoascc.org',
    eligibility: { minAge: 60 },
    howToApply: 'Call the Agency on Aging - services are confidential.',
    howToApplyEs: 'Llame a la Agencia sobre el Envejecimiento - los servicios son confidenciales.',
    tips: [
      'Services are confidential and free',
      'Safe shelter is available at assisted living facilities',
      'They can help with protective orders and safety planning'
    ],
    tipsEs: [
      'Los servicios son confidenciales y gratuitos',
      'Refugio seguro está disponible en instalaciones de vida asistida',
      'Pueden ayudar con órdenes de protección y planificación de seguridad'
    ]
  },
  {
    name: 'Ahrens Respite Program',
    nameEs: 'Programa de Respiro Ahrens',
    organization: 'Agency on Aging of South Central CT',
    description: 'Day program for individuals with Alzheimers or dementia, providing caregivers with respite. Activities include animal therapy, art therapy, and music therapy in a safe, supportive environment.',
    descriptionEs: 'Programa diurno para personas con Alzheimer o demencia, proporcionando respiro a los cuidadores. Las actividades incluyen terapia con animales, terapia de arte y terapia de música.',
    categories: ['healthcare', 'mental-health'],
    address: '1 Long Wharf Drive, Suite 312',
    city: 'Hartford',
    state: 'CT',
    zip: '06511',
    phone: '203-785-8533',
    website: 'https://www.aoascc.org',
    eligibility: {},
    howToApply: 'Contact the Agency on Aging to learn about availability and eligibility.',
    howToApplyEs: 'Contacte la Agencia sobre el Envejecimiento para conocer disponibilidad y elegibilidad.',
    tips: [
      'Gives family caregivers a break while their loved one is cared for',
      'Trained staff provide engaging activities',
      'Contact them to learn about current program locations'
    ],
    tipsEs: [
      'Da a los cuidadores familiares un descanso mientras su ser querido es cuidado',
      'Personal capacitado proporciona actividades atractivas',
      'Contáctelos para conocer las ubicaciones actuales del programa'
    ]
  }
]

async function main() {
  console.log('Adding new resources to database...')

  let added = 0
  let skipped = 0

  for (const resource of newResources) {
    // Check if resource already exists by name
    const existing = await prisma.resource.findFirst({
      where: { name: resource.name }
    })

    if (existing) {
      console.log(`⏭️  Skipping (exists): ${resource.name}`)
      skipped++
      continue
    }

    await prisma.resource.create({
      data: {
        ...resource,
        source: 'manual',
        sourceId: `manual-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }
    })

    console.log(`✅ Added: ${resource.name}`)
    added++
  }

  console.log(`\nDone! Added ${added} resources, skipped ${skipped} existing.`)

  const total = await prisma.resource.count()
  console.log(`Total resources in database: ${total}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
