import { createContext, ReactNode, useContext, useState } from "react";
import { ShoppingCard } from "../components/ShoppingCard";
import { useLocalStorage } from "../hooks/useLocalStorage";

type    ShoppingCardProviderProps = {
    children: ReactNode
}

type ShoppigCardContext = {
    openCard : () => void,
    closeCard : () => void,
    getItemQuantity: (id: number) => number,
    increaseCardQuantity: (id: number) => void,
    decreaseCardQuantity: (id: number) => void,
    removeFromCard: (id: number) => void,
    cardQuantity: number,
    cardItems: CardItem[]
}


type CardItem = {
    id: number,
    quantity: number
}
const ShoppigCardContext = createContext({} as ShoppigCardContext )

export function useShoppingCard () {
    return useContext(ShoppigCardContext)
}



export function ShoppingCardProvider({children}: ShoppingCardProviderProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [cardItems, setCardItems] = useLocalStorage<CardItem[]>("shopping-card",[])

    const cardQuantity = cardItems.reduce((quantity, item) => item.quantity  + quantity, 0)


    const openCard = () => setIsOpen(true)
    const closeCard = () => setIsOpen(false)

    function getItemQuantity (id: number) {
        return cardItems.find(item => item.id === id)?.quantity || 0
    }

    function increaseCardQuantity (id: number) {
       setCardItems(curItems => {
            if(curItems.find(item => item.id === id) ==  null){
                return [...curItems , {id, quantity: 1}]
            }else{
                return curItems.map(item => {
                    if(item.id === id){
                        return {...item , quantity: item.quantity + 1 }
                    }else{
                        return item
                    }
                } )
            }
       })
    }

    function decreaseCardQuantity (id: number) {
       setCardItems(curItems => {
            if(curItems.find(item => item.id === id)?.quantity === 1){
                return curItems.filter(item => item.id !== id)
            }else{
                return curItems.map(item => {
                    if(item.id === id){
                        return {...item , quantity: item.quantity - 1 }
                    }else{
                        return item
                    }
                } )
            }
       })
    }
    function removeFromCard (id: number) {
       setCardItems(curItems => {
            return curItems.filter(item => item.id !== id)
       })
    }

    return <ShoppigCardContext.Provider value={{getItemQuantity, increaseCardQuantity, decreaseCardQuantity, removeFromCard, cardItems, cardQuantity, openCard ,closeCard}}>
        {children}
        <ShoppingCard isOpen={isOpen} />
    </ShoppigCardContext.Provider>
}