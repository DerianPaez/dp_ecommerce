'use client'

import { useCart } from '@/context/cart-context'
import { useProducts } from '@/context/products-context'
import { useDebounce } from '@/hooks/useDobounce.hook'
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { Button, Card, CardBody, CardFooter, CardHeader } from '@nextui-org/react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ProductCardProps } from './types'

export default function ProductCard({ id, image, name, price, isFavorite = false }: ProductCardProps) {
  const router = useRouter()
  const { status } = useSession()
  const { addToCart } = useCart()
  const { markAsFavorite } = useProducts()
  const [isFavoriteProduct, setIsFavoriteProduct] = useState(isFavorite)
  const debouncedFavorite = useDebounce(isFavoriteProduct)

  useEffect(() => {
    if (isFavorite !== isFavoriteProduct) markAsFavorite(id, debouncedFavorite)
  }, [debouncedFavorite])

  const handleFavoriteClick = () => {
    setIsFavoriteProduct(!isFavoriteProduct)
  }

  return (
    <Card
      key={id}
      isPressable
      onPress={() => {
        router.push(id)
      }}
      className='w-full border border-divider dark:border-none rounded-xl py-2'
      as='article'
      shadow='none'
    >
      <CardHeader>
        <figure className='w-full grid justify-center items-center rounded-xl overflow-hidden h-72 relative'>
          <Image src={image} alt={name} fill className='w-full h-full object-cover object-center' />
        </figure>
      </CardHeader>
      <CardBody className='grid gap-1 auto-rows-max'>
        <h3 className='text-left text-lg font-semibold'>{name}</h3>
        <p className='text-left text-xl font-bold'>$ {price}</p>
      </CardBody>
      <CardFooter className='pt-0 gap-2 justify-between'>
        <Button
          onPress={() => addToCart(id)}
          fullWidth={status !== 'authenticated'}
          color='primary'
          variant='flat'
          startContent={<ShoppingCartIcon className='h-5 w-5' />}
        >
          Añadir al carrito
        </Button>
        {status === 'authenticated' && (
          <Button
            onPress={() => {
              handleFavoriteClick()
            }}
            isIconOnly
            variant='light'
          >
            {isFavoriteProduct ? (
              <HeartSolidIcon className='text-red-500 h-6 w-6' />
            ) : (
              <HeartIcon className='text-red-500 h-6 w-6' />
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
