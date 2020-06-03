/**
 * Fields in a request to update a single PET item.
 */
export interface UpdatePetsRequest {
  name: string
  description: string
  dueDate: string
  done: boolean
}