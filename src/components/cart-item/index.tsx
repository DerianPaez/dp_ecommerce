'use client'

import { useCart } from '@/context/cart-context'
import { useDebounce } from '@/hooks/useDobounce.hook'
import { TrashIcon } from '@heroicons/react/24/outline'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from '@nextui-org/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Counter from '../counter'
import { CartItemProps } from './types'

export default function CartItem({ id, name, price, image, productId, quantity }: CartItemProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [count, setCount] = useState(quantity)
  const debouncedCount = useDebounce(count, 1000)
  const { removeFromCart, updateQuantity } = useCart()

  useEffect(() => {
    if (quantity !== count) updateQuantity(productId, debouncedCount)
  }, [debouncedCount])

  return (
    <Card
      id={id}
      shadow='none'
      as='article'
      className='grid sm:grid-cols-cart-item items-start auto-rows-max grid-flow-row'
    >
      <CardHeader>
        <figure className='w-full h-72 sm:w-28 sm:h-28 flex justify-center items-center rounded-xl border border-divider overflow-hidden relative'>
          <Image src={image} fill alt={name} className='h-full w-full object-cover object-center place-items-center' />
        </figure>
      </CardHeader>

      <CardBody className='w-full grid gap-4 grid-flow-row auto-rows-max self-center'>
        <div>
          <div className='grid g-full lg:grid-flow-col gap-0 lg:gap-4 lg:justify-between'>
            <Link href={productId} color='foreground' underline='hover' className='text-sm  cursor-pointer'>
              <h3 className='text-lg font-semibold'>{name}</h3>
            </Link>
            <span className='text-xl font-semibold'>$ {Number((price * count).toFixed(2))}</span>
          </div>
          {price !== Number((price * count).toFixed(2)) && (
            <span>
              <small>P. Unitario</small> $ {price}
            </span>
          )}
        </div>

        <div className='grid gap-2 grid-flow-col auto-cols-max justify-between'>
          <Counter value={count} onCountChange={(value) => setCount(value)} min={1} />
          <Button onPress={onOpen} color='danger' variant='flat' isIconOnly className='lg:hidden'>
            <TrashIcon className='h-5 w-5' />
          </Button>
          <Button
            onPress={onOpen}
            className='w-max hidden lg:flex'
            color='danger'
            variant='flat'
            startContent={<TrashIcon className='h-5 w-5' />}
          >
            Eliminar
          </Button>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className='flex flex-col gap-1'>Eliminar del carrito</ModalHeader>
                  <ModalBody>
                    <p>¿Estas seguro de eliminar el siguiente producto del carrito?</p>
                  </ModalBody>
                  <ModalFooter>
                    <Button color='default' variant='light' onPress={onClose}>
                      Cancelar
                    </Button>
                    <Button
                      color='danger'
                      variant='flat'
                      onPress={() => {
                        removeFromCart(productId)
                        onClose()
                      }}
                    >
                      Eliminar
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </CardBody>
    </Card>
  )
}
