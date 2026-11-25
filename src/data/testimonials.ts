// Real client reviews from the complyTech Fiverr profile. Single source of truth
// for the testimonials page and any aggregateRating markup elsewhere on the site.
export const FIVERR_PROFILE = 'https://www.fiverr.com/ayti_shami?public_mode=true';

export const testimonials = [
  {
    name: 'manny1818',
    initials: 'M',
    country: 'United States',
    countryCode: 'US',
    rating: 5,
    year: '2026',
    review: 'Great job thanks so much.',
    gig: 'Custom Websites, Website Accessibility Audit & Remediation',
    color: '#2d6246',
  },
  {
    name: 'gch280000',
    initials: 'G',
    country: 'United States',
    countryCode: 'US',
    rating: 5,
    year: '2026',
    review: 'Easy to work with, was able to get work done earlier than expected just for when I needed it. Very in depth on what needed to be repaired on the site — would recommend.',
    gig: 'Software Testing, Website Accessibility Audit & Remediation',
    color: '#1a3a2a',
  },
  {
    name: 'chriswolb',
    initials: 'C',
    country: 'United Kingdom',
    countryCode: 'GB',
    rating: 5,
    year: '2026',
    review: 'The work has been done exceptionally fast and to a high standard. Thank you so much.',
    gig: 'Custom Websites, Website Accessibility Audit & Remediation',
    color: '#173300',
  },
  {
    name: 'oblakms',
    initials: 'O',
    country: 'Bosnia and Herzegovina',
    countryCode: 'BA',
    rating: 5,
    year: '2025',
    review: 'The work was delivered within the agreed timeframe and according to the provided specifications. Communication was professional and responses were generally prompt. The code is clean and functional, with a few minor adjustments resolved after feedback. The price matched the scope of the project. Overall, a positive experience and I would consider working together again on future projects.',
    gig: 'Custom Websites, Website Accessibility Audit & Remediation',
    color: '#2d6246',
  },
  {
    name: 'oblakms',
    initials: 'O',
    country: 'Bosnia and Herzegovina',
    countryCode: 'BA',
    rating: 5,
    year: '2025',
    review: 'Fixed several tricky issues in my project and did it with care and patience. Quick to understand the problems, clear about the plan, and kept me updated the whole time. Turnaround was fast, and everything worked as expected after the fixes. Also spotted a few related problems I hadn\'t noticed and suggested improvements — which shows real attention to detail. Highly recommended for anyone looking for reliable, quality work.',
    gig: 'Custom Websites, Website Accessibility Audit & Remediation',
    color: '#1a3a2a',
  },
];

export const avgRating = Number(
  (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1),
);
export const totalReviews = testimonials.length;
