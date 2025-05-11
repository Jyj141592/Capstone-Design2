
import { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate, Link } from 'react-router-dom';
import styles from './ClubBoard.module.css'

function ClubBoard(){
    const {clubId, boardId} = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [board, setBoard] = useState(null);
    const [page, setPage] = useState(1);
    const [posts, setPosts] = useState([]);
    const entirePosts = 30;
    const singlePagePosts = 10;
    const maxPage = entirePosts/singlePagePosts;

    useEffect(() => {
        setBoard({id: 1, title: 'activity', description:'activity board'});
        setPosts([{id: 1, title: 'aa'}, {id: 2, title: 'bb'}, {id: 3, title: 'cc'}, {id: 4, title: 'dd'}]);
        const searchParams = new URLSearchParams(location.search);
        const pageNum = searchParams.get('page');
        if(pageNum !== null){
            setPage(pageNum);
        }
    }, []);

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
            navigate(`/${clubId}/${boardId}?page=${p}`);
        }
    }
    function onWrite(){
        navigate(`/${clubId}/${boardId}/write`);
    }

    const pageNumbers = [];
    const curPageStart = page - (page % 5) + 1;
    const curPageEnd = curPageStart + 4 >= maxPage ? curPageStart + 4 : maxPage;
    for(let i = curPageStart; i <= curPageEnd; i++){
        pageNumbers.push(i);
    }
    return (
        <div className={styles.container}>
            {board &&
                (<div className={styles.boardInfo}>
                    <h2 className={styles.boardTitle}>{board.title}</h2>
                    <p className={styles.boardDesc}>{board.description}</p>
                </div>)
            }
            <div className={styles.header}>
                <button className={styles.writeBtn} onClick={onWrite}>글쓰기</button>
            </div>
            <ul className={styles.postList}>
                {
                    posts.map(post=>(
                        <li key={post.id} className={styles.postItem}>
                            <Link to ={`/${clubId}/${boardId}/${post.id}`} className={styles.postLink}>{post.title}</Link> 
                        </li>
                    ))
                }
            </ul>
            <div className={styles.pagination}>
                <button onClick={goToPrevGroup} disabled={page < 6}>
                    {'<<'}
                </button>

                {
                    pageNumbers.map((p) => (
                        <button key={p} onClick={()=>handlePageClick(p)} className={`${styles.pageBtn} ${p===page?styles.active:''}`}>{p}</button>  
                    ))
                }

                <button onClick={goToNextGroup} disable = {page - (page % 5) + 6 <= maxPage}>
                    {'>>'}
                </button>
            </div>
        </div>
    );
}

export default ClubBoard;