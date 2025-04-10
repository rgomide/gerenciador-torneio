'use client'
import { formatDate, getInstitutions } from '@/services/apiService';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SquareArrowUpRight } from 'lucide-react';
import InstitutionForm from '@/components/InstitutionsComponents/InstitutionForm';
import { useEffect, useState } from 'react';


function page() {
  const [institutions, setInstitutions] = useState([])

  useEffect(() => {
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
            <TableHead>Unidades</TableHead>
            <TableHead>
              <InstitutionForm variant='create' fetchFunction={fetchInstitutions} />
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
                <Link href={`./units/${institution.id}`}>
                  <Button variant='outline' size='icon'>
                    <SquareArrowUpRight />
                  </Button>
                </Link>
              </TableCell>
              <TableCell className="font-medium">
                <InstitutionForm record={institution} onClose={fetchInstitutions} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default page