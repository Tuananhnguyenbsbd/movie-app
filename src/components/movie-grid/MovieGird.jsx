import React, { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import ReactLoading from "react-loading";

import MovieCard from "../movie-card/MovieCard";
import "./movie-grid.scss";
import Button, { OutlineButton } from "../button/Button";
import tmdbApi, { category, movieType, tvType } from "../../api/tmdbApi";
import { AppContext } from "../../context/AppContext";
import Input from "../input/Input";
const MovieGrid = (props) => {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const { setHidenLoading } = useContext(AppContext);
    const { keyword } = useParams();
    useEffect(() => {
        const getList = async () => {
            setHidenLoading(false);
            let response = null;
            if (keyword === undefined) {
                const params = {};
                switch (props.category) {
                    case category.movie:
                        response = await tmdbApi.getMoviesList(
                            movieType.upcoming,
                            { params }
                        );
                        break;
                    default:
                        response = await tmdbApi.getTvList(tvType.popular, {
                            params
                        });
                }
            } else {
                const params = {
                    query: keyword
                };
                response = await tmdbApi.search(props.category, { params });
            }
            setItems(response.results);
            setTotalPage(response.total_pages);
            setHidenLoading(true);
        };
        getList();
    }, [props.category, keyword]);

    const loadMore = async () => {
        let response = null;
        if (keyword === undefined || keyword === "") {
            const params = {
                page: page + 1
            };
            switch (props.category) {
                case category.movie:
                    response = await tmdbApi.getMoviesList(movieType.upcoming, {
                        params
                    });
                    break;
                default:
                    response = await tmdbApi.getTvList(tvType.popular, {
                        params
                    });
            }
        } else {
            const params = {
                page: page + 1,
                query: keyword
            };
            response = await tmdbApi.search(props.category, { params });
        }
        setItems([...items, ...response.results]);
        setPage(page + 1);
        console.log(response);
        console.log(page);
    };

    return (
        <>
            <div className="section mb-3 mt-3">
                <MovieSearch category={props.category} keyword={keyword} />
            </div>
            <div className="movie-grid">
                {items.map((item, i) => (
                    <MovieCard category={props.category} item={item} key={i} />
                ))}
            </div>
            {page < totalPage ? (
                <div className="movie-grid__loadmore">
                    <OutlineButton className="small" onClick={loadMore}>
                        Load more
                    </OutlineButton>
                </div>
            ) : null}
        </>
    );
};

const MovieSearch = (props) => {
    const navigate = useNavigate();

    const [keyword, setKeyword] = useState(props.keyword ? props.keyword : "");

    const goToSearch = useCallback(() => {
        if (keyword.trim().length > 0) {
            navigate(`/${category[props.category]}/search/${keyword}`);
        }
    }, [keyword, props.category, navigate]);

    useEffect(() => {
        const enterEvent = (e) => {
            e.preventDefault();
            if (e.keyCode === 13) {
                goToSearch();
            }
        };
        document.addEventListener("keyup", enterEvent);
        return () => {
            document.removeEventListener("keyup", enterEvent);
        };
    }, [keyword, goToSearch]);

    return (
        <div className="movie-search">
            <Input
                type="text"
                placeholder="Enter keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />
            <Button className="small" onClick={goToSearch}>
                Search
            </Button>
        </div>
    );
};

export default MovieGrid;
