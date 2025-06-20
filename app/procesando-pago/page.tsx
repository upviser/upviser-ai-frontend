"use client"
import { Spinner } from '@/components/ui'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

export default function PayProcess () {

  const router = useRouter()

  const verifyPay = async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const tokenWs = urlParams.get('token_ws')
    const status = urlParams.get('collection_status')
    const tbkToken = urlParams.get('TBK_TOKEN')
    if (tokenWs) {
      const pay = JSON.parse(localStorage.getItem('pay')!)
      const sell = JSON.parse(localStorage.getItem('sell')!)
      if (pay) {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/pay/commit`, { token: tokenWs })
        if (response.data.status === 'AUTHORIZED') {
          await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/pay/${pay._id}`, { state: 'Pago realizado' })
          const service = JSON.parse(localStorage.getItem('service')!)
          const service2 = JSON.parse(localStorage.getItem('service2')!)
          service.step = service2.steps[service2.steps.find((step: any) => step._id === service.step) ? service2.steps.findIndex((step: any) => step._id === service.step) + 1 : 0]._id
          service.payStatus =
            service.payStatus === 'Pago iniciado'
              ? 'Pago realizado'
              : service.payStatus === 'Segundo pago iniciado'
              ? 'Segundo pago realizado'
              : '';
          await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/client/${pay.email}`, { services: [service] })
          router.push('/gracias-por-comprar')
        } else if (response.data.status === 'FAILED') {
          await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/pay/${pay._id}`, { state: 'Pago no realizado' })
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client-email/${pay.email}`)
          const services = [...res.data.services];
          const serviceToUpdate = services.find(service => service.service === pay.service)
          serviceToUpdate.payStatus =
            serviceToUpdate.payStatus === 'Pago iniciado'
              ? 'Pago no realizado'
              : serviceToUpdate.payStatus === 'Segundo pago iniciado'
              ? 'Segundo pago no realizado'
              : '';
          await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/client/${pay.email}`, { services: serviceToUpdate })
          router.push('/pago-fallido')
        }
      } else if (sell) {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/pay/commit`, { token: tokenWs })
        if (response.data.status === 'AUTHORIZED') {
          await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/sell/${sell._id}`, { state: 'Pago realizado', sell: sell })
          router.push('/gracias-por-comprar')
        } else if (response.data.status === 'FAILED') {
          await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/sell/${sell._id}`, { state: 'Pago no realizado' })
          router.push('/pago-fallido')
        }
      }
    } else if (status) {
      const pay = JSON.parse(localStorage.getItem('pay')!)
      const sell = JSON.parse(localStorage.getItem('sell')!)
      if (pay) {
        if (status === 'approved') {
          await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/pay/${pay._id}`, { state: 'Pago realizado' })
          const service = JSON.parse(localStorage.getItem('service')!)
          const service2 = JSON.parse(localStorage.getItem('service2')!)
          service.step = service2.steps[service2.steps.find((step: any) => step._id === service.step) ? service2.steps.findIndex((step: any) => step._id === service.step) + 1 : 0]._id
          service.payStatus =
            service.payStatus === 'Pago iniciado'
              ? 'Pago realizado'
              : service.payStatus === 'Segundo pago iniciado'
              ? 'Segundo pago realizado'
              : '';
          await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/client/${pay.email}`, { services: [service] })
          router.push('/gracias-por-comprar')
        } else {
          await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/pay/${pay._id}`, { state: 'Pago no realizado' })
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client-email/${pay.email}`)
          const services = [...res.data.services];
          const serviceToUpdate = services.find(service => service.service === pay.service)
          serviceToUpdate.payStatus =
            serviceToUpdate.payStatus === 'Pago iniciado'
              ? 'Pago no realizado'
              : serviceToUpdate.payStatus === 'Segundo pago iniciado'
              ? 'Segundo pago no realizado'
              : '';
          await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/client/${pay.email}`, { services: serviceToUpdate })
          router.push('/pago-fallido')
        }
      } else if (sell) {
        if (status === 'approved') {
          await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/sell/${sell._id}`, { state: 'Pago realizado', sell: sell })
          router.push('/gracias-por-comprar')
        } else {
          await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/sell/${sell._id}`, { state: 'Pago no realizado' })
          router.push('/pago-fallido')
        }
      }
    } else if (tbkToken) {
      const pay = JSON.parse(localStorage.getItem('pay')!)
      const sell = JSON.parse(localStorage.getItem('sell')!)
      if (pay) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/pay/${pay._id}`, { state: 'Pago no realizado' })
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client-email/${pay.email}`)
        const services = [...res.data.services];
        const serviceToUpdate = services.find(service => service.service === pay.service)
        serviceToUpdate.payStatus =
          serviceToUpdate.payStatus === 'Pago iniciado'
            ? 'Pago no realizado'
            : serviceToUpdate.payStatus === 'Segundo pago iniciado'
            ? 'Segundo pago no realizado'
            : '';
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/client/${pay.email}`, { services: serviceToUpdate })
        router.push('/pago-fallido')
      } else if (sell) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/sell/${sell._id}`, { state: 'Pago no realizado' })
        router.push('/pago-fallido')
      }
    }
  }

  useEffect(() => {
    verifyPay()
  }, [])

  return (
    <div className='w-full bg-white fixed flex' style={{ height: 'calc(100% - 150px)' }}>
      <div className='w-fit m-auto'>
        <Spinner />
      </div>
    </div>
  )
}