// DRAFT lesson content for the hackathon demo. Not yet reviewed by a clinician or checked line by line
// against MedlinePlus / openFDA. `answer` is the index of the correct option; `concept` keys into `concepts`.
export const topics = [
  {
    id: 'label',
    title: 'Reading a medication label',
    blurb: 'Doses, timing and what the fine print means.',
    concepts: {
      frequency: { name: 'How often to take it', review: '"Twice daily" means two doses in one day, spaced out (often morning and evening). It does not mean two tablets at once. If the label is unclear, ask your pharmacist.' },
      ingredient: { name: 'Active ingredient', review: 'On over-the-counter medicines, the Drug Facts panel lists the active ingredient: the part that does the work. Checking it helps you avoid doubling up on the same ingredient in two products.' },
      expiration: { name: 'Expiration dates', review: 'The expiration date is the last day the maker stands behind the medicine\'s full strength and safety. After that date, it\'s best to ask your pharmacist about disposal and a replacement.' },
      food: { name: '"Take with food"', review: 'Some medicines are gentler on the stomach or absorbed better with food. When a label gives a food instruction, it is there for a reason. Follow it, and ask if it is unclear.' },
      pharmacist: { name: 'Asking your pharmacist', review: 'Pharmacists are trained to check how medicines work together. When you are unsure, asking them is quick, free, and the safest next step.' },
    },
    questions: [
      { id: 'label-1', concept: 'frequency', prompt: 'A label says "Take 1 tablet twice daily." What does that mean?', options: ['Take two tablets at the same time', 'Take 1 tablet two times a day, spaced out', 'Take 1 tablet only when you feel unwell', 'Take 1 tablet every other day'], answer: 1, explain: 'Twice daily means two separate doses in a day, often morning and evening.' },
      { id: 'label-2', concept: 'ingredient', prompt: 'On an over-the-counter medicine, where can you find what the medicine is made of?', options: ['The barcode', 'The brand name in large letters', 'The "Active ingredient" section of the Drug Facts panel', 'The expiration date'], answer: 2, explain: 'The Drug Facts panel lists the active ingredient and how much is in each dose.' },
      { id: 'label-3', concept: 'expiration', prompt: 'What does the expiration date on a medicine tell you?', options: ['The last day you should start taking it', 'The date it was made', 'How long it was on the shelf', 'The date up to which the maker stands behind its strength and safety'], answer: 3, explain: 'After this date the maker cannot promise the medicine works as intended.' },
      { id: 'label-4', concept: 'food', prompt: 'The label says "Take with food." Why might that matter?', options: ['It can protect your stomach or help your body absorb the medicine', 'It means you should eat a big meal', 'It means water is not allowed', 'It is only a suggestion'], answer: 0, explain: 'Food can reduce stomach upset or help absorption, depending on the medicine.' },
      { id: 'label-5', concept: 'pharmacist', prompt: 'You are not sure two medicines are safe together. What is a good next step?', options: ['Look it up on a random forum', 'Ask your pharmacist or care team', 'Take them hours apart and hope for the best', 'Compare the colors of the pills'], answer: 1, explain: 'Pharmacists check for interactions all the time. Asking is the safest move.' },
    ],
  },
  {
    id: 'words',
    title: 'Common label and paperwork words',
    blurb: 'Decode the words that sound bigger than they are.',
    concepts: {
      'as-needed': { name: '"As needed"', review: '"As needed" means take it only when you have the symptom, and still follow the limits on the label, like the most you can take in a day.' },
      refill: { name: 'Refills', review: '"Refills: 2" means you can fill the same prescription two more times without getting a new one from your provider.' },
      'side-effect': { name: 'Side effects', review: 'A side effect is an effect other than the one the medicine is meant for. Some are mild and common. Ask which ones should make you call your care team.' },
      contraindication: { name: 'Contraindications', review: '"Contraindicated" means a situation where a medicine should not be used, such as with another medicine or a health condition. Check with your care team if it might apply to you.' },
      copay: { name: 'Co-pays', review: 'A co-pay is a set amount you pay for a visit or a prescription. Your insurance covers the rest, based on your plan.' },
    },
    questions: [
      { id: 'words-1', concept: 'as-needed', prompt: '"Take as needed for pain" means...', options: ['Take it on a schedule no matter what', 'Take it only when you have pain, within the limits on the label', 'Take double the dose when the pain is bad', 'Stop the moment you feel a bit better'], answer: 1, explain: 'As needed means when you have the symptom, but the label limits still apply.' },
      { id: 'words-2', concept: 'refill', prompt: 'A prescription says "Refills: 2." What does that mean?', options: ['You can fill it 2 more times without a new prescription', 'Take 2 pills more each day', 'It was already refilled twice', 'It lasts exactly 2 weeks'], answer: 0, explain: 'Refills are extra fills of the same prescription.' },
      { id: 'words-3', concept: 'side-effect', prompt: 'A "side effect" is...', options: ['The main reason the medicine was prescribed', 'An effect other than the one the medicine is meant for', 'A sign the medicine is fake', 'The date the medicine runs out'], answer: 1, explain: 'Side effects are other effects. Ask which ones are worth a call.' },
      { id: 'words-4', concept: 'contraindication', prompt: 'A warning says a medicine is "contraindicated" in some situations. That means...', options: ['It works extra well there', 'It is only for children', 'It should not be used in those situations', 'It has expired'], answer: 2, explain: 'Contraindicated means it should not be used in that situation. Ask your care team.' },
      { id: 'words-5', concept: 'copay', prompt: 'What is a "co-pay"?', options: ['A coupon from the pharmacy', 'A second prescription', 'A refund from your insurer', 'A set amount you pay, with insurance covering the rest'], answer: 3, explain: 'A co-pay is your fixed share of a visit or prescription cost.' },
    ],
  },
  {
    id: 'ask',
    title: 'Questions to ask your care team',
    blurb: 'Feel confident speaking up at appointments.',
    concepts: {
      'teach-back': { name: 'Teach-back', review: 'Teach-back means saying the plan in your own words and asking "Did I get that right?" It is a simple way to catch misunderstandings, and clinicians welcome it.' },
      purpose: { name: 'What it is for', review: 'For every new medicine, ask what it is for and how to take it. Knowing the purpose makes it easier to take it correctly.' },
      'missed-dose': { name: 'Missed doses', review: 'Ask in advance what to do if you miss a dose, because the right answer depends on the medicine. Do not double up unless you are told to.' },
      'warning-signs': { name: 'Warning signs', review: 'Ask which problems should make you call right away or get urgent help. Knowing that ahead of time makes it less scary later.' },
      'ask-again': { name: 'Asking again', review: 'If something is confusing, it is always okay to ask for it again in simpler words. Good care teams want you to understand.' },
    },
    questions: [
      { id: 'ask-1', concept: 'teach-back', prompt: 'After a visit, you repeat the plan in your own words and ask "Did I get that right?" What is this called?', options: ['Triage', 'Teach-back', 'Prior authorization', 'A second opinion'], answer: 1, explain: 'Teach-back is a simple way to check that you and your care team are on the same page.' },
      { id: 'ask-2', concept: 'purpose', prompt: 'Which is a helpful question about a new medicine?', options: ['What color is the pill?', 'Who else takes it?', 'What is this for, and how should I take it?', 'Is the bottle recyclable?'], answer: 2, explain: 'Knowing the purpose and the directions helps you take it correctly.' },
      { id: 'ask-3', concept: 'missed-dose', prompt: 'Which question helps you plan for real life?', options: ['What should I do if I miss a dose?', 'Will you remember me next year?', 'Can I read the label later?', 'Is it okay to ignore the label?'], answer: 0, explain: 'The right move for a missed dose depends on the medicine, so ask ahead of time.' },
      { id: 'ask-4', concept: 'warning-signs', prompt: 'Which question helps you stay safe at home?', options: ['Can I ignore any side effects?', 'What problems should make me call you right away?', 'Do I need to know any of this?', 'Can I skip the follow-up?'], answer: 1, explain: 'Knowing the warning signs in advance helps you act calmly if something happens.' },
      { id: 'ask-5', concept: 'ask-again', prompt: 'You did not understand something your provider said. What is okay to do?', options: ['Nod and hope it makes sense later', 'Stay quiet so you do not take their time', 'Assume it is not important', 'Ask them to explain it again in simpler words'], answer: 3, explain: 'Asking again is always okay. Understanding is part of good care.' },
    ],
  },
]
