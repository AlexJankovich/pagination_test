import Head from "next/head";
import {Inter} from "next/font/google";
import Table from "react-bootstrap/Table";
import {Alert, Container} from "react-bootstrap";
import {GetServerSideProps, GetServerSidePropsContext} from "next";
import PaginationBar from "@/components/pagination";

const inter = Inter({subsets: ["latin"]});

type TUserItem = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  updatedAt: string;
};


export type MetaType = {
  page: number;
  pagesCount: number;
  offset: number;
  limit: number;
  itemsCount: number;
  returned: number;
}

type DataType = {
  data: TUserItem[],
  meta: MetaType
}

type TGetServerSideProps = {
  statusCode: number;
  users: DataType;
};

const initialMetaData: MetaType = {
  page: 1,
  itemsCount: 1,
  limit: 20,
  offset: 20,
  returned: 0,
  pagesCount: 0
}


export const getServerSideProps = (async (ctx: GetServerSidePropsContext): Promise<{ props: TGetServerSideProps }> => {
  try {
    const {page, limit} = ctx.query;
    const res = await fetch(`http://localhost:3000/users?page=${page || 1}&limit=${limit || 20}`, {method: "GET"});
    if (!res.ok) {
      return {props: {statusCode: res.status, users: {data: [], meta: initialMetaData}}};
    }

    return {
      props: {statusCode: 200, users: await res.json()},
    };
  } catch (e) {
    return {props: {statusCode: 500, users: {data: [], meta: initialMetaData}}};
  }
}) satisfies GetServerSideProps<TGetServerSideProps>;

export default function Home({statusCode, users}: TGetServerSideProps) {

  if (statusCode !== 200) {
    return <Alert variant={"danger"}>Ошибка {statusCode} при загрузке данных</Alert>;
  }

  const {data, meta} = users

  return (
    <>
      <Head>
        <title>Тестовое задание</title>
        <meta name="description" content="Тестовое задание"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className={inter.className}>
        <Container>
          <h1 className={"mb-5"}>Пользователи</h1>

          <Table striped bordered hover>
            <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Телефон</th>
              <th>Email</th>
              <th>Дата обновления</th>
            </tr>
            </thead>
            <tbody>
            {data.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.firstname}</td>
                <td>{user.lastname}</td>
                <td>{user.phone}</td>
                <td>{user.email}</td>
                <td>{user.updatedAt}</td>
              </tr>
            ))}
            </tbody>
          </Table>

          {/*TODO add pagination*/}
          {meta.pagesCount > 1 && <PaginationBar meta={meta} slug={"/"}/>}

        </Container>
      </main>
    </>
  );
}
