import {useRouter} from "next/router";
import {Pagination} from "react-bootstrap";
import {MetaType} from "@/pages";

type PaginationBarProps = {
  meta: MetaType
  slug: string
}

const PaginationBar = ({meta, slug}: PaginationBarProps) => {

  const router = useRouter();

  const {pagesCount, page} = meta

  const divider = Math.ceil(page / 10);

  const startPage = (divider - 1) * 10 + 1;

  const endPage = startPage + 10 < pagesCount ? startPage + 10 : pagesCount + 1

  const items = [];

  for (let i = startPage; i < endPage; i++) {
    items.push(i);
  }

  const pageHandler = async (page: number) => {
    await router.push(`${slug}?page=${page}`)
  }

  return <div
    style={{
      marginTop: "32px",
      background: "#e9ecef",
      padding: "2px",
      width: "fit-content"
    }}
  >
    <Pagination style={{margin: 0, gap: "3px"}}>
      <Pagination.First
        disabled={page <= 10}
        onClick={() => pageHandler(1)}
      />
      <Pagination.Prev
        disabled={page <= 10}
        onClick={() => divider > 1 && pageHandler(page - 10)}
      />
      {items.map((item) => {
        return (
          <Pagination.Item
            active={item === page}
            key={item}
            onClick={() => item !== page && pageHandler(item)}
          >
            {item}
          </Pagination.Item>
        );
      })}
      <Pagination.Next
        onClick={() =>
          pageHandler(
            page + 10 < pagesCount ? page + 10 : pagesCount,
          )
        }
        disabled={divider === Math.ceil(pagesCount / 10)}
      />
      <Pagination.Last
        onClick={() => pageHandler(pagesCount)}
        disabled={divider === Math.ceil(pagesCount / 10)}
      />
    </Pagination>
  </div>
}

export default PaginationBar
