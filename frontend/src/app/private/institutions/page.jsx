'use client'
import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { DialogClose } from '@radix-ui/react-dialog';
import { createInstitution, formatDate, getInstitutions } from '@/services/apiService';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import CreateInstitution from '@/components/InstitutionsComponents/CreateInstitution';
import UpdateInstitution from '@/components/InstitutionsComponents/UpdateInstitution';


function page() {
  const [institutions, setInstitutions] = React.useState([])

  React.useEffect(() => {
    fetchInstitutions()
  }, [])

  const fetchInstitutions = async () => {
    try {
      const data = await getInstitutions()
      setInstitutions(data)
    } catch (e) {
      console.error(`Erro ao obter instituições: ${e}`);
    }
  }

  return (
    <div className='flex flex-col items-center self-center h-screen w-full p-12 gap-8'>
      <h1>Instituições</h1>

      <Table className='w-full'>
        <TableCaption>Lista de Instituições cadastradas no sistema</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Nome</TableHead>
            <TableHead>Data de registro</TableHead>
            <TableHead>Última atualização</TableHead>
            <TableHead>
              <CreateInstitution fetchFunction={fetchInstitutions} />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {institutions.map((institution) => (
            <TableRow key={institution.id}>
              <TableCell className="font-medium">{institution.name}</TableCell>
              <TableCell className="font-medium">{formatDate(institution.createdAt)}</TableCell>
              <TableCell className="font-medium">{formatDate(institution.updatedAt)}</TableCell>
              <TableCell className="font-medium">
                <UpdateInstitution fetchFunction={fetchInstitutions} prevName={institution.name} id={institution.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default page