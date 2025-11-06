export interface Member {
  id: string
  name: string
  email: string
  password: string
  role: 'admin' | 'user'
  avatarColor: string
}

export interface Reservation {
  id: string
  memberId: string
  memberName: string
  startDate: string
  endDate: string
  numberOfPeople: number
  status: 'confirmed' | 'pending' | 'completed'
}

export interface ConsumptionRecord {
  id: string
  type: 'fioul' | 'electricite'
  date: string
  quantity: number
  cost: number
  addedBy: string
}

export interface FinancialContribution {
  memberId: string
  memberName: string
  totalDays: number
  totalPeople: number
  contribution: number
}
