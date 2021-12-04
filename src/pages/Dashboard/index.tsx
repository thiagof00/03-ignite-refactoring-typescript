import { Component, useEffect, useState } from 'react';

import {Header} from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import {ModalAddFood} from '../../components/ModalAddFood';
import {ModalEditFood} from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface foodProps{
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}

function Dashboard(){
  const [foods, setFoods] = useState<foodProps[]>([]);
  const [editingFood, setEditingFood] = useState<foodProps>({} as foodProps)
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false)

  useEffect(()=>{
    async function LoadFoods() {
      const response = await api.get<foodProps[]>('/foods');
      console.log(response.data)
      setFoods(response.data);
  
    }
    LoadFoods()
  },[])

  async function handleAddFood(food: foodProps){
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

   async function handleUpdateFood (food: foodProps){

    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        {...editingFood,...food},
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

   async function handleDeleteFood (id: number){
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  function toggleModal(){
    setModalOpen(!modalOpen);
  }

  function toggleEditModal (){

    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food:foodProps) {
    setEditingFood(food)
    setEditModalOpen(true)
    console.log("handleEditFood")
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}



export default Dashboard;
