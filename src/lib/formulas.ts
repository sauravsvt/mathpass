export interface FormulaToken {
  token: string;
  constantIds: string[];
  desc: string;
}

export const FORMULA_TOKENS: FormulaToken[] = [
  { token: 'E=mc^2', constantIds: ['speed_of_light'], desc: "Einstein's mass-energy equivalence" },
  { token: 'E=h*f', constantIds: ['planck'], desc: "Planck's energy of a photon" },
  { token: 'S=k*ln(W)', constantIds: ['boltzmann'], desc: "Boltzmann's entropy formula" },
  { token: 'PV=nRT', constantIds: ['gas_constant'], desc: 'Ideal gas law' },
  { token: 'e^(i*Pi)+1=0', constantIds: ['e', 'pi'], desc: "Euler's identity" },
  { token: 'A=Pi*r^2', constantIds: ['pi'], desc: 'Area of a circle' },
  { token: 'C=2*Pi*r', constantIds: ['pi'], desc: 'Circumference of a circle' },
  { token: 'Tau=2*Pi', constantIds: ['tau', 'pi'], desc: 'Tau as two pi' },
  { token: 'Phi=(1+Sqrt5)/2', constantIds: ['phi', 'sqrt5'], desc: 'Golden ratio closed form' },
  { token: 'Phi^2=Phi+1', constantIds: ['phi'], desc: 'Golden ratio recurrence' },
  { token: 'F=G*m*M/r^2', constantIds: ['gravity'], desc: "Newton's law of gravitation" },
  { token: 'a^2+b^2=c^2', constantIds: ['sqrt2'], desc: 'Pythagorean theorem' },
  { token: 'Zeta(2)=Pi^2/6', constantIds: ['basel', 'pi'], desc: 'Basel problem' },
  { token: 'ln(2)', constantIds: ['ln2'], desc: 'Natural logarithm of two' },
  { token: 'Alpha~1/137', constantIds: ['fine_structure'], desc: 'Fine-structure constant' },
  { token: 'T=0K', constantIds: ['absolute_zero'], desc: 'Absolute zero' },
  { token: 'N=n*N_A', constantIds: ['avogadro'], desc: "Avogadro's relation" },
  { token: 'Q=n*e', constantIds: ['elementary_charge'], desc: 'Quantized charge' },
];
