
import { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../api/ApiClient';
import { CLUB_API } from '../api/ClubApi';
import styles from './ClubBoard.module.css'

function ClubBoard(){
    const {clubId, boardId} = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [board, setBoard] = useState(null);
    const [page, setPage] = useState(0);
    const [posts, setPosts] = useState([]);
    const [maxPage, setMaxPage] = useState(0); 
    const singlePagePosts = 10;

    useEffect(() => {
        apiClient.get(CLUB_API.FETCH_BOARD_INFO(clubId, boardId))
            .then(res=>{
                let m = Math.ceil(res.data.count/singlePagePosts);
                setMaxPage(m);
                if (m === 0) {
                    setPage(0);
                }
                setBoard(res.data);
            })
            .catch(err => console.log(err));
        

        // setBoard({id: 1, title: 'activity', description:'activity board'});
        // setPosts([{id: 1, title: 'aa'}, {id: 2, title: 'bb'}, {id: 3, title: 'cc'}, {id: 4, title: 'dd'}]);
        
    }, []);

    useEffect(()=>{
        const searchParams = new URLSearchParams(location.search);
        const pageNum = parseInt(searchParams.get('page'), 10);
        if(pageNum !== null && maxPage >= pageNum){
            setPage(pageNum);
        }
        else {
            setPage(1);
        }

        if(board !== null && page !== 0){
            apiClient.get(CLUB_API.FETCH_POST_LIST(clubId,boardId,page,singlePagePosts))
                .then(res=>{
                    setPosts(res.data);
                })
                .catch(err=>console.log(err));
        }
    }, [board, page])

    function goToPrevGroup(){
        const curPage = page;
        setPage(curPage - (curPage % 5));
    }
    function goToNextGroup(){
        const curPage = page;
        setPage(curPage - (curPage % 5) + 6);
    }
    function handlePageClick(p){
        if(p == page) return;
        else{
            navigate(`/club/${clubId}/${boardId}?page=${p}`);
        }
    }
    function onWrite(){
        navigate(`/club/${clubId}/${boardId}/write`);
    }

    const pageNumbers = [];
    const curPageStart = page - (page % 5) + 1;
    const curPageEnd = curPageStart + 4 < maxPage ? curPageStart + 4 : maxPage;
    for(let i = curPageStart; i <= curPageEnd; i++){
        pageNumbers.push(i);
    }
    return (
        <div className={styles.container}>
            {board &&
                (<div className={styles.boardInfo}>
                    <h2 className={styles.boardTitle}>{board.name}</h2>
                    <p className={styles.boardDesc}>{board.description}</p>
                </div>)
            }
            <div className={styles.header}>
                <button className={styles.writeBtn} onClick={onWrite}>글쓰기</button>
            </div>
            <table className={styles.postTable}>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>작성 일자</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        posts.length > 0 ? (
                        posts.map((post, index) => (
                            <tr key={post.postID}>
                                <td>{(page - 1) * singlePagePosts + index + 1}</td>
                                <td>
                                    <Link to={`/club/${clubId}/${boardId}/${post.postID}`} className={styles.postLink}>
                                    {post.title}
                                    </Link>
                                </td>
                                <td>{post.authorName}</td>
                                <td>{post.createdAt}</td>
                            </tr>
                        ))
                        ) : (
                        <tr>
                            <td colSpan="4" className={styles.emptyMessage}>게시글이 없습니다.</td>
                        </tr>
                        )
                    }
                </tbody>
            </table>

            <div className={styles.pagination}>
                <button onClick={goToPrevGroup} disabled={page < 6}>
                    {'<<'}
                </button>

                {
                    pageNumbers.map((p) => (
                        <button key={p} onClick={()=>handlePageClick(p)} className={`${styles.pageBtn} ${p===page?styles.active:''}`}>{p}</button>  
                    ))
                }

                <button onClick={goToNextGroup} disabled = {page - (page % 5) + 6 > maxPage}>
                    {'>>'}
                </button>
            </div>
        </div>
    );
}

export default ClubBoard;