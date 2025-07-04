import { IProduct } from '@/interfaces'
import React from 'react'
import Image from 'next/image'

export const Information = ({ product }: { product: IProduct }) => {
  return (
    <div className="flex flex-col gap-20 my-20 md:gap-28 md:my-28 lg:gap-36 lg:my-36 p-4">
      {
        product.informations?.map((information, index) => {
          if (information.align === 'Izquierda') {
            return (
              <div key={index} className="flex flex-col gap-16 w-full m-auto max-w-[1280px] sm:flex-row">
                <div className="w-full flex sm:w-1/2 sm:hidden">
                  <Image className="m-auto w-full sm:w-auto" src={information.image} alt={`Imagen zona informativa ${product.name}`} width={500} height={500} />
                </div>
                <div className="flex flex-col gap-2 w-full p-4 sm:p-0 m-auto sm:w-1/2">
                  {
                    information.title !== ''
                      ? <h2>{information.title}</h2>
                      : ''
                  }
                  {
                    information.description !== ''
                      ? <p>{information.description}</p>
                      : ''
                  }
                </div>
                <div className="w-full hidden sm:w-1/2 sm:flex">
                  <Image className="m-auto" src={information.image} alt={`Imagen zona informativa ${product.name}`} width={500} height={500} />
                </div>
              </div>
            )
          } else if (information.align === 'Derecha') {
            return (
              <div key={index} className="flex flex-col gap-16 w-full m-auto max-w-[1280px] sm:flex-row">
                <div className="w-full flex sm:w-1/2">
                  <Image className="m-auto w-full sm:w-auto" src={information.image} alt={`Imagen zona informativa ${product.name}`} width={500} height={500} />
                </div>
                <div className="flex flex-col gap-2 w-full m-auto p-4 sm:p-0 sm:w-1/2">
                  {
                    information.title !== ''
                      ? <h2>{information.title}</h2>
                      : ''
                  }
                  {
                    information.description !== ''
                      ? <p>{information.description}</p>
                      : ''
                  }
                </div>
              </div>
            )
          } else {
            return (
              <div key={index} className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2 p-4 sm:p-0'>
                  {
                    information.title !== ''
                      ? <h2 className='text-center'>{information.title}</h2>
                      : ''
                  }
                  {
                    information.description !== ''
                      ? <p className='text-center'>{information.description}</p>
                      : ''
                  }
                </div>
                <Image className="m-auto w-full sm:w-auto" src={information.image} alt={`Imagen zona informativa ${product.name}`} width={500} height={500} />
              </div>
            )
          }
        })
      }
    </div>
  )
}
