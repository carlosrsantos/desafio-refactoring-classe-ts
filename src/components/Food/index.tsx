import { ReactNode, useEffect, useState } from 'react';
import { FiEdit3, FiTrash } from 'react-icons/fi';

import { Container } from './styles';
import api from '../../services/api';
import { Food } from '../../types';

type FoodInput = Omit<Food, 'available'>;

interface FoodsProviderProps{
  children: ReactNode;
}

interface FoodsContextData{
  food: Food[];
  toogleAvailable:(food: FoodInput) => Promise<void>;
}



export function Food({children}: FoodsProviderProps){
  const [foods, setFoods] = useState<Food[]>([]);
  const[available, setAvailable] = useState(true);
  const { food, handleEditFood } = useState([]);

  useEffect(()=>{
    api.get('foods')
      .then(response => setFoods(response.data.foods))
  },[]);

  async function toogleAvailable(foodInput : FoodInput) {   
    const isAvailable = false;

    const response = await api.put(`/foods/${foodInput.id}`,{
      ...foodInput,
      //fazer verificação aqui
      available: isAvailable      
    })
    setAvailable(isAvailable);

    const {food} = response.data;

    setFoods([
      ...foods,food]);
  }

  function setEditingFood() {
    handleEditFood(food);
  }

   return (
     
     <Container available={true}>
       <header>
         <img src={food.image} alt={food.name} />
       </header>
       <section className="body">
         <h2>{food.name}</h2>
         <p>{food.description}</p>
         <p className="price">
           R$ <b>{food.price}</b>
         </p>
       </section>
       <section className="footer">
         <div className="icon-container">
           <button
             type="button"
             className="icon"
             onClick={this.setEditingFood}
             data-testid={`edit-food-${food.id}`}
           >
             <FiEdit3 size={20} />
           </button>

           <button
             type="button"
             className="icon"
             onClick={() => handleDelete(food.id)}
             data-testid={`remove-food-${food.id}`}
           >
             <FiTrash size={20} />
           </button>
         </div>

         <div className="availability-container">
           <p>{isAvailable ? "Disponível" : "Indisponível"}</p>

           <label htmlFor={`available-switch-${food.id}`} className="switch">
             <input
               id={`available-switch-${food.id}`}
               type="checkbox"
               checked={isAvailable}
               onChange={this.toggleAvailable}
               data-testid={`change-status-food-${food.id}`}
             />
             <span className="slider" />
           </label>
         </div>
       </section>
     </Container>
   );
 }


