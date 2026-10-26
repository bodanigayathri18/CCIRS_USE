/**
 * Official Greater Hyderabad Municipal Corporation (GHMC) 150 Wards Dataset
 * Source of Truth: Government of Telangana - Greater Hyderabad Municipal Corporation (https://www.ghmc.gov.in/)
 * Reference: Delimitation of Wards, GHMC Election Administration, and Departmental Zonal Structure.
 * Structured across 6 Municipal Zones and 30 Administrative Circles covering Wards 1 to 150.
 */

export const GHMC_ZONES = [
  'LB Nagar',
  'Charminar',
  'Khairatabad',
  'Serilingampally',
  'Kukatpally',
  'Secunderabad',
] as const;

export type GHMCZone = (typeof GHMC_ZONES)[number];

export interface GHMCWard {
  wardNumber: number;
  wardName: string;
  zone: GHMCZone;
  circle: string;
  circleNumber?: number;
  pincode?: string;
  approxLat: number;
  approxLng: number;
}

export const GHMC_WARDS: GHMCWard[] = [
  // ==========================================
  // 1. LB NAGAR ZONE (Circles 1 to 5: Wards 1 to 23)
  // ==========================================
  // Circle 1: Kapra
  { wardNumber: 1, wardName: 'Kapra', zone: 'LB Nagar', circle: 'Kapra', circleNumber: 1, approxLat: 17.4912, approxLng: 78.5678 },
  { wardNumber: 2, wardName: 'Dr. A.S. Rao Nagar', zone: 'LB Nagar', circle: 'Kapra', circleNumber: 1, approxLat: 17.4834, approxLng: 78.5589 },
  { wardNumber: 3, wardName: 'Cherlapally', zone: 'LB Nagar', circle: 'Kapra', circleNumber: 1, approxLat: 17.4721, approxLng: 78.5992 },
  { wardNumber: 4, wardName: 'Meerpet H.B. Colony', zone: 'LB Nagar', circle: 'Kapra', circleNumber: 1, approxLat: 17.4611, approxLng: 78.5623 },
  { wardNumber: 5, wardName: 'Mallapur', zone: 'LB Nagar', circle: 'Kapra', circleNumber: 1, approxLat: 17.4489, approxLng: 78.5721 },
  { wardNumber: 6, wardName: 'Nacharam', zone: 'LB Nagar', circle: 'Kapra', circleNumber: 1, approxLat: 17.4287, approxLng: 78.5612 },

  // Circle 2: Uppal
  { wardNumber: 7, wardName: 'Chilukanagar', zone: 'LB Nagar', circle: 'Uppal', circleNumber: 2, approxLat: 17.4123, approxLng: 78.5694 },
  { wardNumber: 8, wardName: 'Habsiguda', zone: 'LB Nagar', circle: 'Uppal', circleNumber: 2, approxLat: 17.4112, approxLng: 78.5489 },
  { wardNumber: 9, wardName: 'Ramanthapur', zone: 'LB Nagar', circle: 'Uppal', circleNumber: 2, approxLat: 17.3989, approxLng: 78.5421 },
  { wardNumber: 10, wardName: 'Uppal', zone: 'LB Nagar', circle: 'Uppal', circleNumber: 2, approxLat: 17.4012, approxLng: 78.5601 },

  // Circle 3: Hayathnagar
  { wardNumber: 11, wardName: 'Nagole', zone: 'LB Nagar', circle: 'Hayathnagar', circleNumber: 3, approxLat: 17.3789, approxLng: 78.5689 },
  { wardNumber: 12, wardName: 'Mansoorabad', zone: 'LB Nagar', circle: 'Hayathnagar', circleNumber: 3, approxLat: 17.3621, approxLng: 78.5712 },
  { wardNumber: 13, wardName: 'Hayathnagar', zone: 'LB Nagar', circle: 'Hayathnagar', circleNumber: 3, approxLat: 17.3245, approxLng: 78.6012 },
  { wardNumber: 14, wardName: 'B.N. Reddy Nagar', zone: 'LB Nagar', circle: 'Hayathnagar', circleNumber: 3, approxLat: 17.3389, approxLng: 78.5698 },

  // Circle 4: L.B. Nagar
  { wardNumber: 15, wardName: 'Vanasthalipuram', zone: 'LB Nagar', circle: 'L.B. Nagar', circleNumber: 4, approxLat: 17.3412, approxLng: 78.5789 },
  { wardNumber: 16, wardName: 'Hastinapuram', zone: 'LB Nagar', circle: 'L.B. Nagar', circleNumber: 4, approxLat: 17.3289, approxLng: 78.5412 },
  { wardNumber: 17, wardName: 'Champapet', zone: 'LB Nagar', circle: 'L.B. Nagar', circleNumber: 4, approxLat: 17.3512, approxLng: 78.5189 },
  { wardNumber: 18, wardName: 'Lingojiguda', zone: 'LB Nagar', circle: 'L.B. Nagar', circleNumber: 4, approxLat: 17.3589, approxLng: 78.5398 },

  // Circle 5: Saroornagar
  { wardNumber: 19, wardName: 'Saroornagar', zone: 'LB Nagar', circle: 'Saroornagar', circleNumber: 5, approxLat: 17.3612, approxLng: 78.5289 },
  { wardNumber: 20, wardName: 'Rama Krishna Puram', zone: 'LB Nagar', circle: 'Saroornagar', circleNumber: 5, approxLat: 17.3712, approxLng: 78.5389 },
  { wardNumber: 21, wardName: 'Kothapet', zone: 'LB Nagar', circle: 'Saroornagar', circleNumber: 5, approxLat: 17.3721, approxLng: 78.5489 },
  { wardNumber: 22, wardName: 'Chaitanyapuri', zone: 'LB Nagar', circle: 'Saroornagar', circleNumber: 5, approxLat: 17.3689, approxLng: 78.5412 },
  { wardNumber: 23, wardName: 'Gaddiannaram', zone: 'LB Nagar', circle: 'Saroornagar', circleNumber: 5, approxLat: 17.3645, approxLng: 78.5212 },

  // ==========================================
  // 2. CHARMINAR ZONE (Circles 6 to 11: Wards 24 to 61)
  // ==========================================
  // Circle 6: Malakpet
  { wardNumber: 24, wardName: 'Saidabad', zone: 'Charminar', circle: 'Malakpet', circleNumber: 6, approxLat: 17.3612, approxLng: 78.5089 },
  { wardNumber: 25, wardName: 'Moosarambagh', zone: 'Charminar', circle: 'Malakpet', circleNumber: 6, approxLat: 17.3712, approxLng: 78.5123 },
  { wardNumber: 26, wardName: 'Old Malakpet', zone: 'Charminar', circle: 'Malakpet', circleNumber: 6, approxLat: 17.3734, approxLng: 78.4989 },
  { wardNumber: 27, wardName: 'Akberbagh', zone: 'Charminar', circle: 'Malakpet', circleNumber: 6, approxLat: 17.3689, approxLng: 78.4989 },
  { wardNumber: 28, wardName: 'Azampura', zone: 'Charminar', circle: 'Malakpet', circleNumber: 6, approxLat: 17.3789, approxLng: 78.4912 },
  { wardNumber: 29, wardName: 'Chawani', zone: 'Charminar', circle: 'Malakpet', circleNumber: 6, approxLat: 17.3623, approxLng: 78.4921 },
  { wardNumber: 30, wardName: 'Dabeerpura', zone: 'Charminar', circle: 'Malakpet', circleNumber: 6, approxLat: 17.3612, approxLng: 78.4889 },

  // Circle 7: Santoshnagar
  { wardNumber: 31, wardName: 'Rein Bazar', zone: 'Charminar', circle: 'Santoshnagar', circleNumber: 7, approxLat: 17.3589, approxLng: 78.4899 },
  { wardNumber: 32, wardName: 'Pathergatti', zone: 'Charminar', circle: 'Santoshnagar', circleNumber: 7, approxLat: 17.3648, approxLng: 78.4765 },
  { wardNumber: 33, wardName: 'Moghalpura', zone: 'Charminar', circle: 'Santoshnagar', circleNumber: 7, approxLat: 17.3589, approxLng: 78.4712 },
  { wardNumber: 34, wardName: 'Talabchanchalam', zone: 'Charminar', circle: 'Santoshnagar', circleNumber: 7, approxLat: 17.3521, approxLng: 78.4842 },
  { wardNumber: 35, wardName: 'Gowlipura', zone: 'Charminar', circle: 'Santoshnagar', circleNumber: 7, approxLat: 17.3589, approxLng: 78.4789 },
  { wardNumber: 36, wardName: 'Lalithabagh', zone: 'Charminar', circle: 'Santoshnagar', circleNumber: 7, approxLat: 17.3489, approxLng: 78.4712 },
  { wardNumber: 37, wardName: 'Kurmaguda', zone: 'Charminar', circle: 'Santoshnagar', circleNumber: 7, approxLat: 17.3589, approxLng: 78.5021 },

  // Circle 8: Chandrayangutta
  { wardNumber: 38, wardName: 'I.S. Sadan', zone: 'Charminar', circle: 'Chandrayangutta', circleNumber: 8, approxLat: 17.3489, approxLng: 78.5089 },
  { wardNumber: 39, wardName: 'Santosh Nagar', zone: 'Charminar', circle: 'Chandrayangutta', circleNumber: 8, approxLat: 17.3412, approxLng: 78.5012 },
  { wardNumber: 40, wardName: 'Riyasath Nagar', zone: 'Charminar', circle: 'Chandrayangutta', circleNumber: 8, approxLat: 17.3389, approxLng: 78.4912 },
  { wardNumber: 41, wardName: 'Kanchanbagh', zone: 'Charminar', circle: 'Chandrayangutta', circleNumber: 8, approxLat: 17.3312, approxLng: 78.5021 },
  { wardNumber: 42, wardName: 'Barkas', zone: 'Charminar', circle: 'Chandrayangutta', circleNumber: 8, approxLat: 17.3189, approxLng: 78.4899 },
  { wardNumber: 43, wardName: 'Chandrayangutta', zone: 'Charminar', circle: 'Chandrayangutta', circleNumber: 8, approxLat: 17.3212, approxLng: 78.4789 },
  { wardNumber: 44, wardName: 'Uppuguda', zone: 'Charminar', circle: 'Chandrayangutta', circleNumber: 8, approxLat: 17.3389, approxLng: 78.4712 },

  // Circle 9: Charminar
  { wardNumber: 45, wardName: 'Jangammet', zone: 'Charminar', circle: 'Charminar', circleNumber: 9, approxLat: 17.3312, approxLng: 78.4689 },
  { wardNumber: 46, wardName: 'Falaknuma', zone: 'Charminar', circle: 'Charminar', circleNumber: 9, approxLat: 17.3312, approxLng: 78.4612 },
  { wardNumber: 47, wardName: 'Nawab Saheb Kunta', zone: 'Charminar', circle: 'Charminar', circleNumber: 9, approxLat: 17.3389, approxLng: 78.4521 },
  { wardNumber: 48, wardName: 'Shalibanda', zone: 'Charminar', circle: 'Charminar', circleNumber: 9, approxLat: 17.3512, approxLng: 78.4689 },
  { wardNumber: 49, wardName: 'Ghansi Bazar', zone: 'Charminar', circle: 'Charminar', circleNumber: 9, approxLat: 17.3621, approxLng: 78.4712 },
  { wardNumber: 50, wardName: 'Begum Bazar', zone: 'Charminar', circle: 'Charminar', circleNumber: 9, approxLat: 17.3745, approxLng: 78.4712 },

  // Circle 10: Falaknuma
  { wardNumber: 51, wardName: 'Goshamahal', zone: 'Charminar', circle: 'Falaknuma', circleNumber: 10, approxLat: 17.3812, approxLng: 78.4689 },
  { wardNumber: 52, wardName: 'Puranapul', zone: 'Charminar', circle: 'Falaknuma', circleNumber: 10, approxLat: 17.3689, approxLng: 78.4612 },
  { wardNumber: 53, wardName: 'Doodhbowli', zone: 'Charminar', circle: 'Falaknuma', circleNumber: 10, approxLat: 17.3589, approxLng: 78.4589 },
  { wardNumber: 54, wardName: 'Jahanuma', zone: 'Charminar', circle: 'Falaknuma', circleNumber: 10, approxLat: 17.3412, approxLng: 78.4589 },
  { wardNumber: 55, wardName: 'Ramnaspura', zone: 'Charminar', circle: 'Falaknuma', circleNumber: 10, approxLat: 17.3512, approxLng: 78.4521 },

  // Circle 11: Rajendranagar
  { wardNumber: 56, wardName: 'Kishanbagh', zone: 'Charminar', circle: 'Rajendranagar', circleNumber: 11, approxLat: 17.3512, approxLng: 78.4412 },
  { wardNumber: 57, wardName: 'Suleman Nagar', zone: 'Charminar', circle: 'Rajendranagar', circleNumber: 11, approxLat: 17.3312, approxLng: 78.4312 },
  { wardNumber: 58, wardName: 'Shastripuram', zone: 'Charminar', circle: 'Rajendranagar', circleNumber: 11, approxLat: 17.3389, approxLng: 78.4389 },
  { wardNumber: 59, wardName: 'Mailardevpally', zone: 'Charminar', circle: 'Rajendranagar', circleNumber: 11, approxLat: 17.3189, approxLng: 78.4289 },
  { wardNumber: 60, wardName: 'Rajendranagar', zone: 'Charminar', circle: 'Rajendranagar', circleNumber: 11, approxLat: 17.3112, approxLng: 78.4089 },
  { wardNumber: 61, wardName: 'Attapur', zone: 'Charminar', circle: 'Rajendranagar', circleNumber: 11, approxLat: 17.3612, approxLng: 78.4289 },

  // ==========================================
  // 3. KHAIRATABAD (CENTRAL) ZONE (Circles 12 to 18: Wards 62 to 100)
  // ==========================================
  // Circle 12: Mehdipatnam
  { wardNumber: 62, wardName: 'Jiyaguda', zone: 'Khairatabad', circle: 'Mehdipatnam', circleNumber: 12, approxLat: 17.3712, approxLng: 78.4489 },
  { wardNumber: 63, wardName: 'Mangalhat', zone: 'Khairatabad', circle: 'Mehdipatnam', circleNumber: 12, approxLat: 17.3789, approxLng: 78.4612 },
  { wardNumber: 64, wardName: 'Dattatreya Nagar', zone: 'Khairatabad', circle: 'Mehdipatnam', circleNumber: 12, approxLat: 17.3812, approxLng: 78.4489 },
  { wardNumber: 65, wardName: 'Karwan', zone: 'Khairatabad', circle: 'Mehdipatnam', circleNumber: 12, approxLat: 17.3789, approxLng: 78.4412 },
  { wardNumber: 66, wardName: 'Langer House', zone: 'Khairatabad', circle: 'Mehdipatnam', circleNumber: 12, approxLat: 17.3741, approxLng: 78.4189 },
  { wardNumber: 67, wardName: 'Golconda', zone: 'Khairatabad', circle: 'Mehdipatnam', circleNumber: 12, approxLat: 17.3833, approxLng: 78.4011 },

  // Circle 13: Karwan
  { wardNumber: 68, wardName: 'Tolichowki', zone: 'Khairatabad', circle: 'Karwan', circleNumber: 13, approxLat: 17.4012, approxLng: 78.4112 },
  { wardNumber: 69, wardName: 'Nanal Nagar', zone: 'Khairatabad', circle: 'Karwan', circleNumber: 13, approxLat: 17.3892, approxLng: 78.4281 },
  { wardNumber: 70, wardName: 'Mehdipatnam', zone: 'Khairatabad', circle: 'Karwan', circleNumber: 13, approxLat: 17.3912, approxLng: 78.4389 },
  { wardNumber: 71, wardName: 'Gudimalkapur', zone: 'Khairatabad', circle: 'Karwan', circleNumber: 13, approxLat: 17.3812, approxLng: 78.4312 },
  { wardNumber: 72, wardName: 'Asif Nagar', zone: 'Khairatabad', circle: 'Karwan', circleNumber: 13, approxLat: 17.3889, approxLng: 78.4412 },

  // Circle 14: Goshamahal
  { wardNumber: 73, wardName: 'Vijayanagar Colony', zone: 'Khairatabad', circle: 'Goshamahal', circleNumber: 14, approxLat: 17.3912, approxLng: 78.4521 },
  { wardNumber: 74, wardName: 'Ahmed Nagar', zone: 'Khairatabad', circle: 'Goshamahal', circleNumber: 14, approxLat: 17.3989, approxLng: 78.4489 },
  { wardNumber: 75, wardName: 'Red Hills', zone: 'Khairatabad', circle: 'Goshamahal', circleNumber: 14, approxLat: 17.3989, approxLng: 78.4689 },
  { wardNumber: 76, wardName: 'Mallepally', zone: 'Khairatabad', circle: 'Goshamahal', circleNumber: 14, approxLat: 17.3945, approxLng: 78.4589 },
  { wardNumber: 77, wardName: 'Jambagh', zone: 'Khairatabad', circle: 'Goshamahal', circleNumber: 14, approxLat: 17.3812, approxLng: 78.4789 },
  { wardNumber: 78, wardName: 'Gunfoundry', zone: 'Khairatabad', circle: 'Goshamahal', circleNumber: 14, approxLat: 17.3945, approxLng: 78.4789 },

  // Circle 15: Musheerabad
  { wardNumber: 79, wardName: 'Himayathnagar', zone: 'Khairatabad', circle: 'Musheerabad', circleNumber: 15, approxLat: 17.4012, approxLng: 78.4812 },
  { wardNumber: 80, wardName: 'Kachiguda', zone: 'Khairatabad', circle: 'Musheerabad', circleNumber: 15, approxLat: 17.3889, approxLng: 78.4989 },
  { wardNumber: 81, wardName: 'Nallakunta', zone: 'Khairatabad', circle: 'Musheerabad', circleNumber: 15, approxLat: 17.3989, approxLng: 78.5012 },
  { wardNumber: 82, wardName: 'Golnaka', zone: 'Khairatabad', circle: 'Musheerabad', circleNumber: 15, approxLat: 17.3812, approxLng: 78.5089 },
  { wardNumber: 83, wardName: 'Amberpet', zone: 'Khairatabad', circle: 'Musheerabad', circleNumber: 15, approxLat: 17.3912, approxLng: 78.5189 },
  { wardNumber: 84, wardName: 'Bagh Amberpet', zone: 'Khairatabad', circle: 'Musheerabad', circleNumber: 15, approxLat: 17.3989, approxLng: 78.5112 },

  // Circle 16: Amberpet
  { wardNumber: 85, wardName: 'Adikmet', zone: 'Khairatabad', circle: 'Amberpet', circleNumber: 16, approxLat: 17.4112, approxLng: 78.5089 },
  { wardNumber: 86, wardName: 'Musheerabad', zone: 'Khairatabad', circle: 'Amberpet', circleNumber: 16, approxLat: 17.4189, approxLng: 78.4989 },
  { wardNumber: 87, wardName: 'Ramnagar', zone: 'Khairatabad', circle: 'Amberpet', circleNumber: 16, approxLat: 17.4112, approxLng: 78.4989 },
  { wardNumber: 88, wardName: 'Bholakpur', zone: 'Khairatabad', circle: 'Amberpet', circleNumber: 16, approxLat: 17.4189, approxLng: 78.4899 },
  { wardNumber: 89, wardName: 'Gandhinagar', zone: 'Khairatabad', circle: 'Amberpet', circleNumber: 16, approxLat: 17.4112, approxLng: 78.4889 },
  { wardNumber: 90, wardName: 'Kavadiguda', zone: 'Khairatabad', circle: 'Amberpet', circleNumber: 16, approxLat: 17.4189, approxLng: 78.4812 },

  // Circle 17: Khairatabad
  { wardNumber: 91, wardName: 'Khairatabad', zone: 'Khairatabad', circle: 'Khairatabad', circleNumber: 17, approxLat: 17.4112, approxLng: 78.4612 },
  { wardNumber: 92, wardName: 'Venkateshwara Colony', zone: 'Khairatabad', circle: 'Khairatabad', circleNumber: 17, approxLat: 17.4112, approxLng: 78.4512 },
  { wardNumber: 93, wardName: 'Banjara Hills', zone: 'Khairatabad', circle: 'Khairatabad', circleNumber: 17, approxLat: 17.4156, approxLng: 78.4345 },
  { wardNumber: 94, wardName: 'Shaikpet', zone: 'Khairatabad', circle: 'Khairatabad', circleNumber: 17, approxLat: 17.4012, approxLng: 78.3989 },
  { wardNumber: 95, wardName: 'Jubilee Hills', zone: 'Khairatabad', circle: 'Khairatabad', circleNumber: 17, approxLat: 17.4312, approxLng: 78.4112 },

  // Circle 18: Jubilee Hills
  { wardNumber: 96, wardName: 'Yousufguda', zone: 'Khairatabad', circle: 'Jubilee Hills', circleNumber: 18, approxLat: 17.4412, approxLng: 78.4312 },
  { wardNumber: 97, wardName: 'Somajiguda', zone: 'Khairatabad', circle: 'Jubilee Hills', circleNumber: 18, approxLat: 17.4212, approxLng: 78.4612 },
  { wardNumber: 98, wardName: 'Ameerpet', zone: 'Khairatabad', circle: 'Jubilee Hills', circleNumber: 18, approxLat: 17.4389, approxLng: 78.4489 },
  { wardNumber: 99, wardName: 'Vengalrao Nagar', zone: 'Khairatabad', circle: 'Jubilee Hills', circleNumber: 18, approxLat: 17.4389, approxLng: 78.4389 },
  { wardNumber: 100, wardName: 'Sanathnagar', zone: 'Khairatabad', circle: 'Jubilee Hills', circleNumber: 18, approxLat: 17.4512, approxLng: 78.4412 },

  // ==========================================
  // 4. SERILINGAMPALLY ZONE (Circles 19 to 22: Wards 101 to 113)
  // ==========================================
  // Circle 19: Yousufguda
  { wardNumber: 101, wardName: 'Erragadda', zone: 'Serilingampally', circle: 'Yousufguda', circleNumber: 19, approxLat: 17.4512, approxLng: 78.4312 },
  { wardNumber: 102, wardName: 'Rahmath Nagar', zone: 'Serilingampally', circle: 'Yousufguda', circleNumber: 19, approxLat: 17.4412, approxLng: 78.4212 },
  { wardNumber: 103, wardName: 'Borabanda', zone: 'Serilingampally', circle: 'Yousufguda', circleNumber: 19, approxLat: 17.4512, approxLng: 78.4112 },

  // Circle 20: Serilingampally
  { wardNumber: 104, wardName: 'Kondapur', zone: 'Serilingampally', circle: 'Serilingampally', circleNumber: 20, approxLat: 17.4689, approxLng: 78.3589 },
  { wardNumber: 105, wardName: 'Gachibowli', zone: 'Serilingampally', circle: 'Serilingampally', circleNumber: 20, approxLat: 17.4401, approxLng: 78.3489 },
  { wardNumber: 106, wardName: 'Serilingampally', zone: 'Serilingampally', circle: 'Serilingampally', circleNumber: 20, approxLat: 17.4812, approxLng: 78.3289 },
  { wardNumber: 107, wardName: 'Madhapur', zone: 'Serilingampally', circle: 'Serilingampally', circleNumber: 20, approxLat: 17.4486, approxLng: 78.3908 },

  // Circle 21: Chandanagar
  { wardNumber: 108, wardName: 'Miyapur', zone: 'Serilingampally', circle: 'Chandanagar', circleNumber: 21, approxLat: 17.4989, approxLng: 78.3589 },
  { wardNumber: 109, wardName: 'Hafeezpet', zone: 'Serilingampally', circle: 'Chandanagar', circleNumber: 21, approxLat: 17.4889, approxLng: 78.3489 },
  { wardNumber: 110, wardName: 'Chandanagar', zone: 'Serilingampally', circle: 'Chandanagar', circleNumber: 21, approxLat: 17.4912, approxLng: 78.3289 },

  // Circle 22: RC Puram & Patancheru
  { wardNumber: 111, wardName: 'Bharathi Nagar', zone: 'Serilingampally', circle: 'RC Puram & Patancheru', circleNumber: 22, approxLat: 17.5112, approxLng: 78.3112 },
  { wardNumber: 112, wardName: 'Ramachandrapuram', zone: 'Serilingampally', circle: 'RC Puram & Patancheru', circleNumber: 22, approxLat: 17.5189, approxLng: 78.2989 },
  { wardNumber: 113, wardName: 'Patancheru', zone: 'Serilingampally', circle: 'RC Puram & Patancheru', circleNumber: 22, approxLat: 17.5312, approxLng: 78.2612 },

  // ==========================================
  // 5. KUKATPALLY ZONE (Circles 23 to 27: Wards 114 to 135)
  // ==========================================
  // Circle 23: Moosapet
  { wardNumber: 114, wardName: 'KPHB Colony', zone: 'Kukatpally', circle: 'Moosapet', circleNumber: 23, approxLat: 17.4923, approxLng: 78.3989 },
  { wardNumber: 115, wardName: 'Balaji Nagar', zone: 'Kukatpally', circle: 'Moosapet', circleNumber: 23, approxLat: 17.4889, approxLng: 78.4089 },
  { wardNumber: 116, wardName: 'Allapur', zone: 'Kukatpally', circle: 'Moosapet', circleNumber: 23, approxLat: 17.4612, approxLng: 78.4312 },
  { wardNumber: 117, wardName: 'Moosapet', zone: 'Kukatpally', circle: 'Moosapet', circleNumber: 23, approxLat: 17.4689, approxLng: 78.4212 },
  { wardNumber: 118, wardName: 'Fateh Nagar', zone: 'Kukatpally', circle: 'Moosapet', circleNumber: 23, approxLat: 17.4612, approxLng: 78.4412 },

  // Circle 24: Kukatpally
  { wardNumber: 119, wardName: 'Old Bowenpally', zone: 'Kukatpally', circle: 'Kukatpally', circleNumber: 24, approxLat: 17.4712, approxLng: 78.4689 },
  { wardNumber: 120, wardName: 'Balanagar', zone: 'Kukatpally', circle: 'Kukatpally', circleNumber: 24, approxLat: 17.4712, approxLng: 78.4412 },
  { wardNumber: 121, wardName: 'Kukatpally', zone: 'Kukatpally', circle: 'Kukatpally', circleNumber: 24, approxLat: 17.4849, approxLng: 78.4138 },
  { wardNumber: 122, wardName: 'Vivekananda Nagar Colony', zone: 'Kukatpally', circle: 'Kukatpally', circleNumber: 24, approxLat: 17.4912, approxLng: 78.4189 },
  { wardNumber: 123, wardName: 'Hydernagar', zone: 'Kukatpally', circle: 'Kukatpally', circleNumber: 24, approxLat: 17.4989, approxLng: 78.3889 },
  { wardNumber: 124, wardName: 'Allwyn Colony', zone: 'Kukatpally', circle: 'Kukatpally', circleNumber: 24, approxLat: 17.5089, approxLng: 78.4089 },

  // Circle 25: Quthbullapur
  { wardNumber: 125, wardName: 'Gajularamaram', zone: 'Kukatpally', circle: 'Quthbullapur', circleNumber: 25, approxLat: 17.5389, approxLng: 78.4212 },
  { wardNumber: 126, wardName: 'Jagadgirigutta', zone: 'Kukatpally', circle: 'Quthbullapur', circleNumber: 25, approxLat: 17.5089, approxLng: 78.4289 },
  { wardNumber: 127, wardName: 'Rangareddy Nagar', zone: 'Kukatpally', circle: 'Quthbullapur', circleNumber: 25, approxLat: 17.4989, approxLng: 78.4312 },
  { wardNumber: 128, wardName: 'Chintal', zone: 'Kukatpally', circle: 'Quthbullapur', circleNumber: 25, approxLat: 17.5089, approxLng: 78.4489 },

  // Circle 26: Gajularamaram
  { wardNumber: 129, wardName: 'Suraram', zone: 'Kukatpally', circle: 'Gajularamaram', circleNumber: 26, approxLat: 17.5312, approxLng: 78.4389 },
  { wardNumber: 130, wardName: 'Subhash Nagar', zone: 'Kukatpally', circle: 'Gajularamaram', circleNumber: 26, approxLat: 17.5189, approxLng: 78.4512 },
  { wardNumber: 131, wardName: 'Quthbullapur', zone: 'Kukatpally', circle: 'Gajularamaram', circleNumber: 26, approxLat: 17.5112, approxLng: 78.4612 },
  { wardNumber: 132, wardName: 'Jeedimetla', zone: 'Kukatpally', circle: 'Gajularamaram', circleNumber: 26, approxLat: 17.5212, approxLng: 78.4689 },

  // Circle 27: Alwal
  { wardNumber: 133, wardName: 'Macha Bollaram', zone: 'Kukatpally', circle: 'Alwal', circleNumber: 27, approxLat: 17.5189, approxLng: 78.5189 },
  { wardNumber: 134, wardName: 'Alwal', zone: 'Kukatpally', circle: 'Alwal', circleNumber: 27, approxLat: 17.5012, approxLng: 78.5089 },
  { wardNumber: 135, wardName: 'Venkatapuram', zone: 'Kukatpally', circle: 'Alwal', circleNumber: 27, approxLat: 17.4912, approxLng: 78.5012 },

  // ==========================================
  // 6. SECUNDERABAD ZONE (Circles 28 to 30: Wards 136 to 150)
  // ==========================================
  // Circle 28: Malkajgiri
  { wardNumber: 136, wardName: 'Neredmet', zone: 'Secunderabad', circle: 'Malkajgiri', circleNumber: 28, approxLat: 17.4889, approxLng: 78.5289 },
  { wardNumber: 137, wardName: 'Vinayak Nagar', zone: 'Secunderabad', circle: 'Malkajgiri', circleNumber: 28, approxLat: 17.4789, approxLng: 78.5212 },
  { wardNumber: 138, wardName: 'Moula Ali', zone: 'Secunderabad', circle: 'Malkajgiri', circleNumber: 28, approxLat: 17.4689, approxLng: 78.5512 },
  { wardNumber: 139, wardName: 'East Anandbagh', zone: 'Secunderabad', circle: 'Malkajgiri', circleNumber: 28, approxLat: 17.4589, approxLng: 78.5389 },
  { wardNumber: 140, wardName: 'Malkajgiri', zone: 'Secunderabad', circle: 'Malkajgiri', circleNumber: 28, approxLat: 17.4512, approxLng: 78.5312 },
  { wardNumber: 141, wardName: 'Gautam Nagar', zone: 'Secunderabad', circle: 'Malkajgiri', circleNumber: 28, approxLat: 17.4589, approxLng: 78.5212 },

  // Circle 29: Secunderabad
  { wardNumber: 142, wardName: 'Addagutta', zone: 'Secunderabad', circle: 'Secunderabad', circleNumber: 29, approxLat: 17.4412, approxLng: 78.5112 },
  { wardNumber: 143, wardName: 'Tarnaka', zone: 'Secunderabad', circle: 'Secunderabad', circleNumber: 29, approxLat: 17.4289, approxLng: 78.5312 },
  { wardNumber: 144, wardName: 'Mettuguda', zone: 'Secunderabad', circle: 'Secunderabad', circleNumber: 29, approxLat: 17.4389, approxLng: 78.5189 },
  { wardNumber: 145, wardName: 'Sitaphalmandi', zone: 'Secunderabad', circle: 'Secunderabad', circleNumber: 29, approxLat: 17.4289, approxLng: 78.5112 },
  { wardNumber: 146, wardName: 'Boudha Nagar', zone: 'Secunderabad', circle: 'Secunderabad', circleNumber: 29, approxLat: 17.4212, approxLng: 78.5012 },
  { wardNumber: 147, wardName: 'Bansilalpet', zone: 'Secunderabad', circle: 'Secunderabad', circleNumber: 29, approxLat: 17.4312, approxLng: 78.4912 },

  // Circle 30: Begumpet
  { wardNumber: 148, wardName: 'Ramgopalpet', zone: 'Secunderabad', circle: 'Begumpet', circleNumber: 30, approxLat: 17.4389, approxLng: 78.4889 },
  { wardNumber: 149, wardName: 'Begumpet', zone: 'Secunderabad', circle: 'Begumpet', circleNumber: 30, approxLat: 17.4412, approxLng: 78.4712 },
  { wardNumber: 150, wardName: 'Monda Market', zone: 'Secunderabad', circle: 'Begumpet', circleNumber: 30, approxLat: 17.4389, approxLng: 78.5012 },
];

/**
 * Finds a GHMC ward by its official ward number (1 to 150).
 */
export function getGHMCWardByNumber(wardNumber: number | string | null | undefined): GHMCWard | undefined {
  if (wardNumber === null || wardNumber === undefined || wardNumber === '') return undefined;
  const num = typeof wardNumber === 'string' ? parseInt(wardNumber, 10) : wardNumber;
  if (isNaN(num)) return undefined;
  return GHMC_WARDS.find((w) => w.wardNumber === num);
}

/**
 * Standardized label formatter for GHMC ward display.
 * Returns formatted string like: "Ward 129 — Suraram"
 */
export function formatGHMCWardLabel(ward: GHMCWard | undefined | null): string {
  if (!ward) return 'Unassigned GHMC Ward';
  return `Ward ${ward.wardNumber} — ${ward.wardName}`;
}

/**
 * Standardized detailed label formatter including circle and zone.
 * Returns: "Ward 129 — Suraram (Gajularamaram Circle, Kukatpally Zone)"
 */
export function formatGHMCWardFullLabel(ward: GHMCWard | undefined | null): string {
  if (!ward) return 'Unassigned GHMC Ward';
  return `Ward ${ward.wardNumber} — ${ward.wardName} (${ward.circle} Circle, ${ward.zone} Zone)`;
}

/**
 * Finds the closest GHMC ward based on haversine distance.
 */
export function getClosestGHMCWard(lat: number, lng: number): GHMCWard {
  let closest = GHMC_WARDS[0];
  let minDistance = Infinity;

  for (const ward of GHMC_WARDS) {
    const dLat = (ward.approxLat - lat) * (Math.PI / 180);
    const dLng = (ward.approxLng - lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat * (Math.PI / 180)) *
        Math.cos(ward.approxLat * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = 6371 * c; // Earth radius in km

    if (distance < minDistance) {
      minDistance = distance;
      closest = ward;
    }
  }

  return closest;
}
