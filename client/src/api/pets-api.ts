import { apiEndpoint } from '../config'
import { Pets } from '../types/Pets';
import { CreatePetRequest } from '../types/CreatePetRequest';
import Axios from 'axios'
import { UpdatePetRequest } from '../types/UpdatePetRequest';

export async function getPets(idToken: string): Promise<Pets[]> {
  console.log('Fetching pets')

  const response = await Axios.get(`${apiEndpoint}/pets`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Pets:', response.data)
  return response.data.items
}

export async function createPet(
  idToken: string,
  newPet: CreatePetRequest
): Promise<Pets> {
  const response = await Axios.post(`${apiEndpoint}/pets`, JSON.stringify(newPet), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchPet(
  idToken: string,
  petId: string,
  updatedPet: UpdatePetRequest
): Promise<void> {

  

await Axios.patch(`${apiEndpoint}/pets/${petId}`, JSON.stringify(updatedPet), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deletePet(
  idToken: string,
  petId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/pets/${petId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  petId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/pets/${petId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
