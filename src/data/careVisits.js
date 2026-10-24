// DRAFT lesson content, written in our own words. Not clinician-reviewed.
// `answer` is the index of the correct option; `concept` keys into `concepts`.
export const careTopics = [
  {
    id: 'teach',
    title: 'Teach-back',
    blurb: 'Check that you and your care team understand each other.',
    source: 'Reference: AHRQ teach-back guidance. Draft, not clinician-reviewed.',
    concepts: {
      what: { name: 'What teach-back is', review: 'Teach-back means saying the plan back in your own words, so you and your care team can both see it was understood.' },
      'whose-job': { name: 'Who it checks', review: 'Teach-back is mainly a check on how well the explanation worked. It is not a test of you.' },
      phrases: { name: 'How to start', review: 'You can start with a simple line like "Let me say that back so I know I understood." Care teams welcome it.' },
      practice: { name: 'Trying it out', review: 'A good teach-back repeats the plan in your own words and ends with "Did I get that right?"' },
      mistakes: { name: 'Getting it wrong is okay', review: 'If part of your summary is off, that is the whole point. Your care team can clear it up before you leave.' },
    },
    questions: [
      { id: 'teach-1', concept: 'what', prompt: 'What is teach-back?', options: ['Taking your results home to study', 'Saying the plan back in your own words to check it was understood', 'A quiz your doctor uses to grade you', 'Reading your chart out loud'], answer: 1, explain: 'Teach-back is a quick check that the explanation worked for you.' },
      { id: 'teach-2', concept: 'whose-job', prompt: 'Teach-back is mainly a check on...', options: ['How smart the patient is', 'How fast the visit went', 'How well the care team explained things', 'Whether you brought a list'], answer: 2, explain: 'It shows whether the explanation was clear. It is not a test of you.' },
      { id: 'teach-3', concept: 'phrases', prompt: 'Which is a good way to start teach-back?', options: ['"I\'m fine, thanks."', '"Let me say that back so I know I understood."', '"Can we skip the instructions?"', '"I\'ll figure it out later."'], answer: 1, explain: 'A short, friendly line like this works well.' },
      { id: 'teach-4', concept: 'practice', prompt: 'Your provider says to take a new medicine with breakfast and with dinner. Which is a good teach-back?', options: ['"Okay."', '"Is that all?"', '"So I take it twice a day, once with breakfast and once with dinner. Did I get that right?"', '"I\'ll take it whenever."'], answer: 2, explain: 'It repeats the plan in your own words and invites a correction.' },
      { id: 'teach-5', concept: 'mistakes', prompt: 'You say the plan back and get part of it wrong. What happens next?', options: ['You have failed and should stay quiet next time', 'Your care team can clear it up, which is the point', 'The plan is cancelled', 'You repeat the whole visit'], answer: 1, explain: 'Catching a mix-up before you leave is exactly what teach-back is for.' },
    ],
  },
  {
    id: 'checkups',
    title: 'Checkups and screenings',
    blurb: 'Know what preventive care is and how to ask about it.',
    source: 'Reference: HHS myhealthfinder, U.S. Preventive Services Task Force, Healthcare.gov. Draft, not clinician-reviewed.',
    concepts: {
      preventive: { name: 'Preventive visits', review: 'A preventive visit, like a checkup, is for staying well and catching problems early. It is different from a visit for a problem you already have.' },
      screening: { name: 'Screenings', review: 'A screening is a test for people who have no symptoms, done to find a problem early.' },
      diagnostic: { name: 'Diagnostic tests', review: 'A test ordered because you have symptoms or a worrying result is usually called diagnostic. It can be billed differently from a screening.' },
      personal: { name: 'What is right for you', review: 'Which screenings you need depends on things like your age, sex, family history and health risks. Ask your care team. Tools like myhealthfinder from health.gov can give ideas by age and sex.' },
      'cost-check': { name: 'Checking coverage', review: 'Many plans cover certain preventive services at no cost, but coverage varies. Check your own plan or ask the office before you go.' },
    },
    questions: [
      { id: 'checkups-1', concept: 'preventive', prompt: 'A preventive visit, like a checkup, is mainly for...', options: ['Only when you are very sick', 'Staying well and catching problems early', 'Refilling a prescription', 'Replacing the emergency room'], answer: 1, explain: 'Preventive care aims to keep you healthy. It is separate from visits for a specific problem.' },
      { id: 'checkups-2', concept: 'screening', prompt: 'What is a health screening?', options: ['A test for a problem you already have symptoms of', 'A test for people with no symptoms, to find problems early', 'A check on whether you can afford care', 'A private room for exams'], answer: 1, explain: 'Screenings look for problems before you notice anything.' },
      { id: 'checkups-3', concept: 'diagnostic', prompt: 'A test ordered because you have symptoms is usually called...', options: ['A screening', 'A vaccine', 'A diagnostic test', 'A referral'], answer: 2, explain: 'Diagnostic tests look into a symptom or a worrying result.' },
      { id: 'checkups-4', concept: 'personal', prompt: 'Which screenings are right for you can depend on...', options: ['Only your zip code', 'The day of the week', 'Your age, sex, family history and health risks', 'Whether you own a car'], answer: 2, explain: 'It differs from person to person, so ask your care team. Tools like myhealthfinder can give ideas by age and sex.' },
      { id: 'checkups-5', concept: 'cost-check', prompt: 'Many plans cover certain preventive services at no cost. What should you do before assuming?', options: ['Assume everything is free', 'Check your plan or ask the office what is covered', 'Skip the visit', 'Never ask about cost'], answer: 1, explain: 'Coverage varies, and a test can be billed differently if it counts as diagnostic. Ask before you go.' },
    ],
  },
  {
    id: 'prepare',
    title: 'Get ready for your visit',
    blurb: 'Simple steps that help a short visit go further.',
    source: 'Draft written for this demo. Not clinician-reviewed.',
    concepts: {
      questions: { name: 'Write your questions down', review: 'Visits can be short and it is easy to forget things. A written list keeps the important questions in front of you.' },
      medlist: { name: 'Your medicine list', review: 'Be ready to share everything you take, including over-the-counter medicines and supplements, because they can affect other treatments.' },
      support: { name: 'Bringing support', review: 'If you want, bring someone you trust to help listen and take notes. Ask the office about any rules for visitors.' },
      language: { name: 'Language help', review: 'If another language would be more comfortable, ask the office about an interpreter. Ask when you book so they can plan.' },
      followup: { name: 'After the visit', review: 'Questions often come up later. Most offices welcome a call or a patient portal message.' },
    },
    questions: [
      { id: 'prepare-1', concept: 'questions', prompt: 'Why write your questions down before a visit?', options: ['The doctor grades them', 'It is required', 'So you remember what matters in a short visit', 'So you can skip the exam'], answer: 2, explain: 'A list keeps your important questions in front of you.' },
      { id: 'prepare-2', concept: 'medlist', prompt: 'What should you be ready to share about your medicines?', options: ['Only prescriptions', 'Everything you take, including over-the-counter medicines and supplements', 'Nothing, the office has it all', 'Only the brand names you like'], answer: 1, explain: 'Over-the-counter medicines and supplements can affect other treatments.' },
      { id: 'prepare-3', concept: 'support', prompt: 'Bringing a friend or family member can help you...', options: ['Take notes and remember what was said', 'Skip your own questions', 'Speed up the visit', 'Pay the bill'], answer: 0, explain: 'Another set of ears helps. It is your choice, and you can ask the office about their rules.' },
      { id: 'prepare-4', concept: 'language', prompt: 'You would be more comfortable in another language. What can you do?', options: ['Stay quiet', 'Bring only a dictionary', 'Skip the visit', 'Ask the office about an interpreter'], answer: 3, explain: 'Many offices can arrange interpreter help. Ask when you book.' },
      { id: 'prepare-5', concept: 'followup', prompt: 'You remember a question after you leave. What is a good next step?', options: ['Forget it', 'Call the office or send a patient portal message', 'Wait a year', 'Guess the answer'], answer: 1, explain: 'Most offices welcome follow-up questions by phone or portal.' },
    ],
  },
]
