
const summarizeVisitReason = async (req, res) => {
  try {
    const { reason, doctorName, patientName } = req.body;

    if (!reason || reason.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a visit reason or symptoms to generate a summary.'
      });
    }

    const text = reason.trim();

    if (process.env.GEMINI_API_KEY) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are an expert clinical medical intake assistant. Provide a concise 2-sentence clinical appointment summary for the doctor based on this patient's reason for visit. Patient: ${patientName || 'Patient'}. Doctor: ${doctorName || 'Doctor'}. Reason: "${text}". Summary format: "Clinical Summary: [Concise summary]. Recommended Prep: [Brief prep/tests if relevant]."`
              }]
            }]
          })
        });
        const data = await response.json();
        const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          return res.status(200).json({
            success: true,
            source: 'Gemini AI API',
            summary: candidateText.trim()
          });
        }
      } catch (externalErr) {
        console.warn('Gemini API call failed, falling back to smart triage summarizer:', externalErr.message);
      }
    }

    const lower = text.toLowerCase();
    let priority = 'Standard';
    let specialtyHint = 'General Consultation';
    let prepNote = 'Bring previous medical records and current prescriptions.';

    if (lower.includes('chest') || lower.includes('heart') || lower.includes('palpitation') || lower.includes('breath')) {
      priority = 'High Priority';
      specialtyHint = 'Cardiology / Pulmonology';
      prepNote = 'Avoid caffeine 3 hours before appointment; baseline ECG recommended.';
    } else if (lower.includes('fever') || lower.includes('cough') || lower.includes('cold') || lower.includes('throat')) {
      priority = 'Moderate';
      specialtyHint = 'Infectious Disease / Internal Medicine';
      prepNote = 'Please wear a mask upon clinic arrival; log temperature history.';
    } else if (lower.includes('knee') || lower.includes('back') || lower.includes('joint') || lower.includes('bone') || lower.includes('fracture')) {
      priority = 'Moderate';
      specialtyHint = 'Orthopedics / Physical Therapy';
      prepNote = 'Wear loose, comfortable clothing for physical joint mobility evaluation.';
    } else if (lower.includes('skin') || lower.includes('rash') || lower.includes('allergy') || lower.includes('itch')) {
      priority = 'Routine';
      specialtyHint = 'Dermatology / Allergy';
      prepNote = 'Do not apply topical creams or lotions 4 hours prior to examination.';
    } else if (lower.includes('child') || lower.includes('baby') || lower.includes('pediatric') || lower.includes('vaccin')) {
      priority = 'Routine';
      specialtyHint = 'Pediatrics';
      prepNote = 'Bring immunization booklet and growth chart history.';
    }

    const summary = `Clinical Summary: Patient presenting with ${text.length > 80 ? text.slice(0, 80) + '...' : text}. Categorized as [${priority} - ${specialtyHint}]. Suggested Prep: ${prepNote}`;

    return res.status(200).json({
      success: true,
      source: 'Intelligent Clinical Assistant',
      summary
    });
  } catch (err) {
    console.error('AI summary error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate visit summary.'
    });
  }
};

module.exports = {
  summarizeVisitReason
};

