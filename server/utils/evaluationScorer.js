// Deterministic, rule-based scoring engine for the Startup Evaluation Form.
// Mirrors the 100-point weighted rubric (Founder Profile 15, Problem & Solution 20,
// Market Opportunity 10, Product Readiness 15, Traction 15, Business Model 10,
// Funding Readiness 10, Legal & Compliance 5, Vision & Investment Potential 10).

const wordCount = (str) => (str || '').trim().split(/\s+/).filter(Boolean).length;
const filled = (str) => !!(str && str.trim());
const num = (str) => {
  const n = parseFloat(String(str || '').replace(/[^0-9.]/g, ''));
  return isNaN(n) ? 0 : n;
};

function scoreFounderProfile(d) {
  let s = 0;
  if (d.fullTime && /yes/i.test(d.fullTime)) s += 5;
  const founders = num(d.numberOfFounders);
  if (founders >= 2 && founders <= 4) s += 2;
  else if (founders === 1) s += 1;
  if (wordCount(d.founderBackground) >= 60) s += 4;
  else if (wordCount(d.founderBackground) >= 20) s += 2;
  if (filled(d.linkedinProfile)) s += 2;
  if (filled(d.industrySector)) s += 1;
  if (filled(d.website)) s += 1;
  return Math.min(15, s);
}

function scoreProblemSolution(d) {
  const fields = [d.oneLineDescription, d.problemSolved, d.targetCustomer, d.howItWorks, d.differentiation];
  let s = 0;
  fields.forEach((f) => {
    if (wordCount(f) >= 8) s += 4;
    else if (filled(f)) s += 2;
  });
  return Math.min(20, s);
}

function scoreMarketOpportunity(d) {
  let s = 0;
  if (filled(d.targetMarket)) s += 3;
  if (filled(d.estimatedMarketSize)) s += 2;
  if (filled(d.mainCompetitors)) s += 2;
  if (wordCount(d.whyCustomersChooseYou) >= 8) s += 3;
  else if (filled(d.whyCustomersChooseYou)) s += 1;
  return Math.min(10, s);
}

function scoreProductReadiness(d) {
  const stageMap = { Idea: 4, Prototype: 8, MVP: 11, 'Live Product': 14 };
  let s = stageMap[d.productStage] || 0;
  if (d.pitchDeck && d.pitchDeck.filename) s += 1;
  return Math.min(15, s);
}

function scoreTraction(d) {
  let s = 0;
  if (num(d.numberOfUsers) > 0) s += 3;
  if (num(d.payingCustomers) > 0) s += 4;
  if (num(d.monthlyRevenue) > 0) s += 4;
  if (num(d.monthlyGrowthPercent) > 0) s += 2;
  if (d.pilotCustomers && /yes/i.test(d.pilotCustomers)) s += 1;
  if (filled(d.partnerships)) s += 1;
  return Math.min(15, s);
}

function scoreBusinessModel(d) {
  let s = 0;
  if (wordCount(d.howYouMakeMoney) >= 6) s += 4;
  else if (filled(d.howYouMakeMoney)) s += 2;
  if (filled(d.pricingModel)) s += 3;
  if (filled(d.expectedRevenue12Months)) s += 3;
  return Math.min(10, s);
}

function scoreFundingReadiness(d) {
  let s = 0;
  if (filled(d.raisedFundingBefore)) s += 2;
  if (filled(d.expectedFundingCurrentStage)) s += 3;
  if ((d.plannedUseOfFunds || []).length >= 1) s += 3;
  if (!/yes/i.test(d.raisedFundingBefore || '') || filled(d.amountRaised)) s += 2;
  return Math.min(10, s);
}

function scoreLegalCompliance(d) {
  const checked = (d.legalCompliance || []).length;
  return Math.min(5, checked);
}

function scoreVisionInvestment(d) {
  const fields = [d.whyBuildingThis, d.fiveYearVision, d.whyInvestInYou];
  let s = 0;
  fields.forEach((f) => {
    if (wordCount(f) >= 10) s += 3.33;
    else if (filled(f)) s += 1.5;
  });
  return Math.min(10, Math.round(s));
}

function evaluateStartup(d) {
  const scores = {
    founderProfile: scoreFounderProfile(d),
    problemSolution: scoreProblemSolution(d),
    marketOpportunity: scoreMarketOpportunity(d),
    productReadiness: scoreProductReadiness(d),
    traction: scoreTraction(d),
    businessModel: scoreBusinessModel(d),
    fundingReadiness: scoreFundingReadiness(d),
    legalCompliance: scoreLegalCompliance(d),
    visionInvestment: scoreVisionInvestment(d)
  };

  const overallScore = Math.round(Object.values(scores).reduce((a, b) => a + b, 0));

  const strengths = [];
  const risks = [];
  const missingInfo = [];
  const nextSteps = [];

  if (scores.founderProfile >= 10) strengths.push('Experienced, committed founding team');
  if (scores.problemSolution >= 15) strengths.push('Clear articulation of problem and solution');
  if (scores.traction >= 10) strengths.push('Demonstrated early customer traction');
  if (scores.marketOpportunity >= 7) strengths.push('Well-defined market opportunity');
  if (scores.legalCompliance >= 4) strengths.push('Strong legal and compliance foundation');
  if ((d.plannedUseOfFunds || []).length >= 1 && scores.fundingReadiness >= 7) strengths.push('Clear plan for fund utilization');
  if (strengths.length === 0) strengths.push('Early-stage submission — more detail needed to identify clear strengths');

  if (scores.traction < 6) risks.push('No or very limited validation/traction with customers yet');
  if (scores.problemSolution < 10) risks.push('Problem-solution fit is not clearly articulated');
  if (scores.legalCompliance < 2) risks.push('Missing key statutory registrations or IP protection');
  if (num(d.numberOfFounders) === 1) risks.push('Solo founder — no co-founder or core team redundancy');
  if (!filled(d.mainCompetitors)) risks.push('Competitive landscape not clearly mapped, differentiation unclear');
  if (scores.fundingReadiness < 5) risks.push('Funding ask and use of funds not clearly defined');
  if (risks.length === 0) risks.push('No major red flags identified from the submitted information');

  if (!d.linkedinProfile) missingInfo.push('LinkedIn profile not provided');
  if (!d.pitchDeck || !d.pitchDeck.filename) missingInfo.push('Pitch deck not uploaded');
  if (!filled(d.estimatedMarketSize)) missingInfo.push('Estimated market size not provided');
  if (!filled(d.amountRaised) && /yes/i.test(d.raisedFundingBefore || '')) missingInfo.push('Amount raised in prior rounds not specified');
  if ((d.legalCompliance || []).length === 0) missingInfo.push('No legal/compliance milestones selected');
  if (!filled(d.expectedRevenue12Months)) missingInfo.push('12-month revenue projection not provided');

  if (d.productStage === 'Idea' || d.productStage === 'Prototype') nextSteps.push('Build and ship an MVP to start collecting real user feedback');
  if (scores.traction < 8) nextSteps.push('Validate demand with 20-50 target customers and capture case studies');
  if (scores.legalCompliance < 3) nextSteps.push('Register the company (or complete Startup India/DPIIT) and file for trademark/patent protection');
  if (!filled(d.expectedRevenue12Months) || scores.businessModel < 7) nextSteps.push('Prepare a 12-24 month financial projection with clear revenue assumptions');
  if (!d.pitchDeck || !d.pitchDeck.filename) nextSteps.push('Prepare and upload an investor-ready pitch deck');
  if (nextSteps.length === 0) nextSteps.push('Continue strengthening traction metrics and prepare for investor outreach');

  return {
    scores,
    overallScore,
    strengths: strengths.slice(0, 5),
    risks: risks.slice(0, 5),
    missingInfo,
    nextSteps
  };
}

module.exports = { evaluateStartup };
