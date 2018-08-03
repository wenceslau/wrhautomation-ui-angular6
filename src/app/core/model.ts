export class BaseModel {
  code: number;
  dateRecord: Date;
  dateUpadte: Date;
  status: boolean;
}

export class BaseFilter {
  code: number;
  status: boolean;
  orderBy; string;
}

export class Bool {
  status: boolean;
  value; string;
  object: any;
}

export class Address {
  logradouro: string;
  neighborhood: string;
  cep: string;
  city: string;
  stateOfCity: string;
}

export class Person {
  cpf: string;
  rg: string;
  name: string;
  nickname: string;
  dateOfBirth: Date;
  address: Address;
  phone: string;
  mobilePhone: string;
  email: string;
  information: string;
}

export class Company extends BaseModel {
  codGroup: string;
  group: string;
  externalCode: string;
  name: string;
  nameFantasy: string;
  cnpj: string;
  ie: string;
  address: Address;
  phone: string;
  main: boolean;
  imported: boolean;
}

export class Employee extends BaseModel {
  person: Person;
  company: Company;
  position: string;
  dateOfHiring: Date;
  situation: string;
  salary: string;
  payment: string;
  fixedSalary: number;
  lpt2Salary: number;
  transportVoucher: boolean;
  numDependentIrrf: number;
  numDependentFamilySalary: number;
  salesExternalCode: string;
  supplierExternalCode: string;
  quebraCaixa: number;
  garantia: number;
  monthlyHourlyLoad: number;
}

export class Datasource extends BaseModel {
  description: string;
  provider: string;
  name: string;
  host: string;
  port: number;
  instance: string;
  nameDataBase: string;
  userDataBase: string;
  passwordDataBase: string;
  integration: boolean;
}

export class Metadata extends BaseModel {
  description: string;
  key: string;
  data1: string;
  data2: string;
  data3: string;
  data4: string;
  data5: string;
  data6: string;
}

export class Query extends BaseModel {
  name: string;
  identifier: string;
  query: string;
  datasource: Datasource;
}

export class Permission {
  role: string;
  description: string;
}

export class Profile {
  code: number;
  name: string;
  identifier: string;
  permissions: Permission[];
}

export class Account extends BaseModel {
  name: string;
  username: string;
  profile: Profile;
}

export class Aliquot extends BaseModel {
  typeAliquot: string;
  initialValue: number;
  finalValue: number;
  percentage: number;
  quota: number;
  deduction: number;
  deductionDependent: number;
}

export class Advance extends BaseModel{
  referenceMonth: Date;
  employee: Employee;
  amount: number;
  discount: number;
  information: string;
}

export class Rescission extends BaseModel{
  referenceMonth: Date;
  employee: Employee;
  dataRescisision: Date;
  saldoSalario_50: number;
  comissao_51: number;
  gratificacao_52: number;
  adicionalInsalubridade_53: number;
  adicionalPericuliosidade_54: number;
  adicionalNoturno_55: number;
  horasExtras_56: number;
  gorjetas_57: number;
  dsr_58: number;
  dsrSobreSaldoSalario_59: number;
  multaArtigo447_60: number;
  multaArtigo479_61: number;
  salarioFamilia_62: number;
  salarioProporcional_63: number;
  _13SalarioExercicioAnterior_64: number;
  feriasProporcional_65: number;
  feriasVencidas_66: number;
  tercoConstituicional_68: number;
  avisoPrevioIndenizado_69: number;
  _13SalarioAvisoPrevio_70: number;
  feriasAvisoPrevio_71: number;
  diversos_95: number;
  ajusteSaldoDevedor_99: number;
  indenizacaoExperiencia_000: number;
  complementoPiso_000: number;
  totalReceitas: number;
  pensaAlimenticia_100: number;
  adiantamentoSalarial_101: number;
  adiantamento13Salario_102: number;
  avisoPrevioIndenizado_103: number;
  previdenciaSocial_112_1: number;
  previdenciaSocial13Salario_112_2: number;
  irrf_114: number;
  irrf13Salario_114_1: number;
  arredondamentoAnterior_115: number;
  faltas_000: number;
  convenioMedico_000: number;
  valeTransporte_000: number;
  descMedicamento_000: number;
  contSindical_000: number;
  totalDeducoes: number;
  valorLiquido: number;
  fgts: number;
  solicitada: Boolean;
  information: string;
}

export class Vacation extends BaseModel{
  referenceMonth: Date;
  employee: Employee;
  daysOfVacation: number;
  initialReference: Date;
  finalReference: Date;
  initialEnjoy: Date;
  finalEnjoy: Date;
  amountVacation: number;
  amoutThird: number;
  familySalary: number;
  inss: number;
  irrf: number;
  manualInput: Boolean;
}

export class Payroll extends BaseModel{
  referenceMonth: Date;
  employee: Employee;
  workedDays: number;
  vacationDays: number;
  vacationPeriod: number;
  vacationPeriodWithouThird: number;
  vacationDifference: number;
  complement13: number;
  maternityPay: number;
  fixedSalary: number;
  commission: number;
  dsr: number;
  prize: number;
  quebraCaixa: number;
  bonus: number;
  holidayWorked: number;
  extraHour: number;
  garantia: number;
  familySalary: number;
  vacationPaid: number;
  sizeAbsencesHours: number;
  absences: number;
  advanceSalary: number;
  drugstore: number;
  medicalAgreement: number;
  syndicateContribution: number;
  numTransportVaucher: number;
  transportVaucher: number;
  inss: number;
  inssVacation: number;
  irrf: number;
  fgts: number;
  rounding: number;
  amountToPay: number;
  closed: boolean;
  manualInput: boolean;
  partialInput: boolean;
}

export class PaymentDetailed extends BaseModel{
  amount: number;
  description: string;
}

export class Payment extends BaseModel{
  referenceMonth: Date;
  companyId: number;
  companyName: string;
  supplierId: number;
  supplierName: string;
  titleId: number;
  titleName: string;
  documentId: string;
  typePaymentId: string;
  desdobramento: string;
  movimentDate: Date;
  dueDate: Date;
  amount: number;
  information: string;
  landed: Boolean;
  paymentBillDetaileds: PaymentDetailed[]
}


export class Plpt2 extends BaseModel{
  referenceMonth: Date;
  employee: Employee;
  amount: number;
  discount: number;
  information: string;
}
