
import { useState, useEffect } from "react";
import {

  NavLink
} from "react-router-dom";
import './Pagination.scss'
const Paginations = (props) => {
  const [choose, setchoose] = useState(0)
  const [BD, setDB] = useState(0)
  const [TongST, setTongST] = useState(0)
  const [SoHT, SetSoHT] = useState(0)
  const [page, setPage] = useState([])
  const [list, setList] = useState([])
  const [lists, setLists] = useState([])
  const changechoose = (e) => {
    let page = choose
    if (e === '+') {
      if (choose < TongST - 1) {
        setchoose(choose + 1);
        page = page + 1;
      }


    }

    else
      if (e === '-') {
        if (choose > 0) {
          setchoose(choose - 1)
          page--
        }

      }

      else {
        setchoose(e)
        page = e
      }

    let lists = props.list.slice(SoHT * (page), (page + 1) * SoHT)
    props.getlist(lists)
    // console.log(page)
  }
  useEffect(() => {
    // console.log(props.list)
    setList(props.list)
    SetSoHT(props.itemsPerPage)

    setPage([...Array(Math.ceil(props.list.length / props.itemsPerPage)).keys()])
    setTongST(Math.ceil(props.list.length / props.itemsPerPage))

    let lists = props.list.slice(SoHT * (choose), (choose + 1) * SoHT)
    if (lists.length == 0) {
      setchoose(0)
      lists = props.list.slice(SoHT * (0), (1) * SoHT)
    }
    props.getlist(lists)

  }, [props.list])
  return (

    <>
      {
        page.length > 0 && (<div className="pagination">
          <a href="#" onClick={() => changechoose("-")} style={{ pointerEvents: choose == 0 ? "none" : "", backgroundColor: choose == 0 ? "grey" : "" }}  >&laquo;</a>
          {

            page.map((item, index) => {
              return (
                <a key={index} href="#" value={item} onClick={() => changechoose(item)} className={choose == item ? "active" : ""}>{item + 1}</a>
              )
            })
          }

          <a href="#" onClick={() => changechoose("+")} style={{ pointerEvents: choose == TongST - 1 ? "none" : "", backgroundColor: choose == TongST - 1 ? "grey" : "" }}>&raquo;</a>
        </div>)
      }


    </>
  )
}
export default Paginations;