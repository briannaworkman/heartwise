// DRAFT lesson content, written in our own words from common health insurance definitions
// (see the Healthcare.gov glossary). Not reviewed by an expert. Plans differ, so lessons say "check your plan".
export const costTopics = [
  {
    id: 'terms',
    title: 'The four costs',
    blurb: 'Premium, deductible, copay and coinsurance.',
    source: 'Reference: Healthcare.gov glossary. Draft, not expert-reviewed.',
    concepts: {
      premium: { name: 'Premium', review: 'The premium is the amount you pay regularly, often monthly, to have health insurance. You pay it even in months you use no care.' },
      deductible: { name: 'Deductible', review: 'The deductible is what you pay for covered care before your plan starts to pay its share. Some services may be covered sooner, so check your plan.' },
      copay: { name: 'Copay', review: 'A copay is a fixed amount you pay for a covered service, like $25 for a doctor visit.' },
      coinsurance: { name: 'Coinsurance', review: 'Coinsurance is your share of a covered service as a percentage of its cost, for example 20 percent.' },
      compare: { name: 'Telling them apart', review: 'Premium is the price of having the plan. The other three are what you pay when you use care.' },
    },
    questions: [
      { id: 'terms-1', concept: 'premium', prompt: 'The amount you pay regularly to have health insurance is called a...', options: ['Deductible', 'Copay', 'Premium', 'Allowed amount'], answer: 2, explain: 'The premium is the regular price of having the plan.' },
      { id: 'terms-2', concept: 'deductible', prompt: 'What is a deductible?', options: ['A fee for missing an appointment', 'What you pay for covered care before your plan starts paying its share', 'The monthly bill', 'A discount on medicines'], answer: 1, explain: 'Some services may be covered before you meet it, so check your plan.' },
      { id: 'terms-3', concept: 'copay', prompt: 'A fixed $25 charge when you see your doctor is a...', options: ['Premium', 'Deductible', 'Coinsurance', 'Copay'], answer: 3, explain: 'A copay is a set amount for a covered service.' },
      { id: 'terms-4', concept: 'coinsurance', prompt: 'Coinsurance is...', options: ['Your share of a covered service as a percentage of its cost', 'A flat fee per visit', 'The monthly price', 'The most your plan will ever pay'], answer: 0, explain: 'For example, paying 20 percent of a covered cost.' },
      { id: 'terms-5', concept: 'compare', prompt: 'Which one do you pay even in a month when you use no care?', options: ['Copay', 'Premium', 'Coinsurance', 'Deductible'], answer: 1, explain: 'The premium is the price of having the plan.' },
    ],
  },
  {
    id: 'network',
    title: 'Networks and limits',
    blurb: 'In-network care, out-of-pocket limits and approvals.',
    source: 'Reference: Healthcare.gov glossary. Draft, not expert-reviewed.',
    concepts: {
      'in-network': { name: 'In-network', review: 'In-network providers have an agreement with your plan. Using them usually costs less.' },
      'out-network': { name: 'Out-of-network', review: 'Out-of-network care can cost more or may not be covered at all, depending on your plan.' },
      'oop-max': { name: 'Out-of-pocket maximum', review: 'This is the most you would pay for covered services in a plan year. After you reach it, your plan generally pays for covered services. Premiums and non-covered care usually do not count toward it.' },
      'prior-auth': { name: 'Prior authorization', review: 'Some services or medicines need your plan to approve them before you get them. Ask the office whether yours does.' },
      'ask-first': { name: 'Asking before you go', review: 'Before planned care, ask whether the provider and service are covered and whether you need approval.' },
    },
    questions: [
      { id: 'network-1', concept: 'in-network', prompt: 'An in-network provider is one who...', options: ['Works only online', 'Is closest to your home', 'Has an agreement with your insurance plan', 'Does not accept insurance'], answer: 2, explain: 'Using in-network providers usually costs less.' },
      { id: 'network-2', concept: 'out-network', prompt: 'Seeing an out-of-network provider can mean...', options: ['You may pay more or have less coverage', 'It is always cheaper', 'Your premium is refunded', 'Nothing changes'], answer: 0, explain: 'Out-of-network care can cost more or may not be covered.' },
      { id: 'network-3', concept: 'oop-max', prompt: 'An out-of-pocket maximum is...', options: ['The monthly price of your plan', 'The most your insurer will pay in your lifetime', 'The most you would pay for covered services in a plan year', 'The same as your deductible'], answer: 2, explain: 'After you reach it, your plan generally pays for covered services. Some costs do not count toward it.' },
      { id: 'network-4', concept: 'prior-auth', prompt: 'Prior authorization means...', options: ['You pay in advance', 'Your doctor already approved the bill', 'It is a free pass', 'Your plan must approve a service or medicine before you get it'], answer: 3, explain: 'Ask the office whether something needs approval before you schedule it.' },
      { id: 'network-5', concept: 'ask-first', prompt: 'Before a planned procedure, a smart question is...', options: ['Is this provider and service covered by my plan, and do I need approval?', 'Can I pay with a coupon?', 'Is the building new?', 'Can I skip the deductible?'], answer: 0, explain: 'Asking first can prevent surprise bills.' },
    ],
  },
  {
    id: 'bills',
    title: 'Bills and statements',
    blurb: 'Read what arrives in the mail and know what to ask.',
    source: 'Draft written for this demo. Not expert-reviewed.',
    concepts: {
      eob: { name: 'Explanation of Benefits', review: 'An Explanation of Benefits (EOB) from your insurer shows what was billed and what your plan paid. It is not a bill. Compare it with bills from providers.' },
      itemized: { name: 'Itemized bills', review: 'You can ask for an itemized bill, which lists each charge, so you can check what you are being asked to pay.' },
      errors: { name: 'Charges you do not recognize', review: 'If a charge looks wrong, call the provider\'s billing office and your insurer to ask about it.' },
      assistance: { name: 'Help with big bills', review: 'Many hospitals and clinics offer payment plans or financial assistance. Asking costs nothing.' },
      'preventive-diagnostic': { name: 'Preventive or diagnostic', review: 'A routine checkup and a test ordered for a symptom can be billed differently. It is fair to ask how something will be billed.' },
    },
    questions: [
      { id: 'bills-1', concept: 'eob', prompt: 'An "Explanation of Benefits" (EOB) from your insurer is...', options: ['A bill you must pay right away', 'Not a bill. It shows what was billed and what your plan paid', 'A coupon', 'A prescription'], answer: 1, explain: 'Compare it with the bills you get from providers.' },
      { id: 'bills-2', concept: 'itemized', prompt: 'How can you see each charge on a clinic or hospital bill?', options: ['Guess', 'Throw it away', 'Pay and hope', 'Ask for an itemized bill'], answer: 3, explain: 'An itemized bill lists every charge.' },
      { id: 'bills-3', concept: 'errors', prompt: 'You see a charge you do not recognize. A good first step is...', options: ['Ignore it', 'Call the billing office and your insurer to ask about it', 'Pay it twice to be safe', 'Throw the bill away'], answer: 1, explain: 'Questions often clear up mix-ups or catch errors.' },
      { id: 'bills-4', concept: 'assistance', prompt: 'A bill feels too big to pay. What can you do?', options: ['Hide the bill', 'Wait until it goes away', 'Ask the billing office about payment plans or financial assistance', 'Only pay in cash'], answer: 2, explain: 'Many places offer help, and asking costs nothing.' },
      { id: 'bills-5', concept: 'preventive-diagnostic', prompt: 'Why ask whether something will be billed as preventive or diagnostic?', options: ['Coverage and cost can depend on which it is', 'Tests are always free', 'Insurers never read bills', 'To avoid seeing a doctor'], answer: 0, explain: 'A routine checkup and a test for a symptom can be billed differently.' },
    ],
  },
]
