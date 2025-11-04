import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface SPARQLBinding {
  value: string;
}

interface OfficeBinding {
  department: SPARQLBinding;
  nameDepDe: SPARQLBinding;
  nameDepFr: SPARQLBinding;
  nameDepIt: SPARQLBinding;
  nameDepEn?: SPARQLBinding;
  altNameDepDe: SPARQLBinding;
  altNameDepFr: SPARQLBinding;
  altNameDepIt: SPARQLBinding;
  altNameDepEn?: SPARQLBinding;
  office?: SPARQLBinding;
  nameDe: SPARQLBinding;
  nameFr: SPARQLBinding;
  nameIt: SPARQLBinding;
  nameEn?: SPARQLBinding;
}

interface SPARQLResult {
  results: {
    bindings: OfficeBinding[];
  };
}

interface MultilingualName {
  de: string;
  fr: string;
  it: string;
  en?: string;
}

interface Organisation {
  id: string;
  name: MultilingualName;
}

interface Department {
  id: string;
  name: MultilingualName;
  abbreviation: MultilingualName;
  organisations: Organisation[];
}

function generateOrganisations(): void {
  const officesPath = path.join(__dirname, 'offices.json');
  const departementsPath = path.join(__dirname, 'departements.json');
  const outputPath = path.join(__dirname, 'organisations.json');

  const officesData: SPARQLResult = JSON.parse(fs.readFileSync(officesPath, 'utf-8'));
  const departementsData: SPARQLResult = JSON.parse(fs.readFileSync(departementsPath, 'utf-8'));

  // Group offices by department
  const departmentMap = new Map<string, {
    info: OfficeBinding;
    offices: OfficeBinding[];
  }>();

  // Process offices - these are departments with offices
  for (const binding of officesData.results.bindings) {
    const deptId = binding.department.value;
    
    if (!departmentMap.has(deptId)) {
      departmentMap.set(deptId, {
        info: binding,
        offices: []
      });
    }
    
    if (binding.office) {
      departmentMap.get(deptId)!.offices.push(binding);
    }
  }

  // Process all departments to find those without offices
  const allDepartments = new Map<string, OfficeBinding>();
  for (const binding of departementsData.results.bindings) {
    const deptId = binding.department.value;
    if (!allDepartments.has(deptId)) {
      allDepartments.set(deptId, binding);
    }
  }

  const departments: Department[] = [];

  // First, add departments with offices
  for (const [deptId, data] of departmentMap) {
    const dept: Department = {
      id: deptId,
      name: {
        de: data.info.nameDepDe.value,
        fr: data.info.nameDepFr.value,
        it: data.info.nameDepIt.value,
        en: data.info.nameDepEn?.value || '',
      },
      abbreviation: {
        de: data.info.altNameDepDe.value,
        fr: data.info.altNameDepFr.value,
        it: data.info.altNameDepIt.value,
        en: data.info.altNameDepEn?.value || '',
      },
      organisations: data.offices.map(office => ({
        id: office.office!.value,
        name: {
          de: office.nameDe.value,
          fr: office.nameFr.value,
          it: office.nameIt.value,
          en: office.nameEn?.value || '',
        }
      }))
    };
    
    departments.push(dept);
  }

  // Then, add departments without offices (they list themselves as an organisation)
  for (const [deptId, binding] of allDepartments) {
    if (!departmentMap.has(deptId)) {
      const dept: Department = {
        id: deptId,
        name: {
          de: binding.nameDepDe.value,
          fr: binding.nameDepFr.value,
          it: binding.nameDepIt.value,
          en: binding.nameDepEn?.value,
        },
        abbreviation: {
          de: binding.altNameDepDe.value,
          fr: binding.altNameDepFr.value,
          it: binding.altNameDepIt.value,
          en: binding.altNameDepEn?.value,
        },
        organisations: [{
          id: deptId,
          name: {
            de: binding.nameDepDe.value,
            fr: binding.nameDepFr.value,
            it: binding.nameDepIt.value,
            en: binding.nameDepEn?.value || '',
          }
        }]
      };
      
      departments.push(dept);
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(departments, null, 2) + '\n');
  
  console.log(`✓ Successfully generated ${outputPath}`);
  console.log(`  - ${departments.length} departments`);
  console.log(`  - ${departments.reduce((sum, d) => sum + d.organisations.length, 0)} organisations`);
}

try {
  generateOrganisations();
} catch (error) {
  console.error('Error generating organisations:', error);
  process.exit(1);
}
