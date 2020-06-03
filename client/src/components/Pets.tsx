import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  TextArea,
  Form
} from 'semantic-ui-react'

import { createPet, deletePet, getPets, patchPet } from '../api/pets-api'
import Auth from '../auth/Auth'
import { Pets } from '../types/Pets'

interface PetsProps {
  auth: Auth
  history: History
}

interface PetsState {
  pets: Pets[]
  newPetName: string
  newPetDescription: string
  loadingPets: boolean
}

export class Pet extends React.PureComponent<PetsProps, PetsState> {
  state: PetsState = {
    pets: [],
    newPetName: '',
    newPetDescription: '',
    loadingPets: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newPetName: event.target.value })
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ newPetDescription: event.target.value })
  }

  onEditButtonClick = (petId: string) => {
    this.props.history.push(`/pets/${petId}/edit`)
  }

  onPetCreate = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    
    try {
      const dueDate = this.calculateDueDate()
      const newPet = await createPet(this.props.auth.getIdToken(), {
        name: this.state.newPetName,
        description: this.state.newPetDescription,
        dueDate
      })
      this.setState({
        pets: [...this.state.pets, newPet],
        newPetName: '',
        newPetDescription: ''
      })
    } catch {
      alert('Pet creation failed')
    }
  }

  onPetDelete = async (petId: string) => {
    try {
      await deletePet(this.props.auth.getIdToken(), petId)
      this.setState({
        pets: this.state.pets.filter(pet => pet.petId != petId)
      })
    } catch {
      alert('Pet deletion failed')
    }
  }

  onPetCheck = async (pos: number) => {
    try {
      const pet = this.state.pets[pos]
      await patchPet(this.props.auth.getIdToken(), pet.petId, {
        name: pet.name,
        description: pet.description,
        dueDate: pet.dueDate,
        done: !pet.done
      })
      this.setState({
        pets: update(this.state.pets, {
          [pos]: { done: { $set: !pet.done } }
        })
      })
    } catch {
      alert('Peet deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const pets = await getPets(this.props.auth.getIdToken())
      this.setState({
        pets,
        loadingPets: false
      })
    } catch (e) {
      alert(`Failed to fetch pets: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Pets</Header>

        {this.renderCreatePet()}

        {this.renderPets()}
      </div>
    )
  }

  renderCreatePet() {
    return (
      <div>
        <Form onSubmit={this.onPetCreate}>
          <Form.Field>
            <label>Name</label>
            <input
              placeholder="Pet Name"
              value={this.state.newPetName}
              onChange={this.handleNameChange}
              required
            />
          </Form.Field>
          <Form.Field>
            <label>Description</label>
            <textarea
              placeholder="What happend....?"
              value={this.state.newPetDescription}
              onChange={this.handleDescriptionChange}
            />
          </Form.Field>
          {this.renderButton()}
        </Form>
      </div>
    )   
  }

  renderButton() {
    return (
      <Button icon color="teal" type="submit">
        New Pet &nbsp; <Icon name="add" />
      </Button>
    )
  }
  

  renderPets() {
    if (this.state.loadingPets) {
      return this.renderLoading()
    }

    return this.renderPetsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Pets
        </Loader>
      </Grid.Row>
    )
  }

  renderPetsList() {
    return (
      <Grid padded>
        {this.state.pets.map((pet, pos) => {
          return (
            <Grid.Row key={pet.petId}>
              {pet.attachmentUrl && (
                <Image src={pet.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={2}>
                {pet.name}
              </Grid.Column>
              <Grid.Column width={6}>
                {pet.description}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {pet.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="green"
                  onClick={() => this.onEditButtonClick(pet.petId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onPetDelete(pet.petId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>              
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
