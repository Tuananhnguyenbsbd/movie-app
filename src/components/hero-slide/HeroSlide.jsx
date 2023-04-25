import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import apiConfig from "../../api/apiConfig";
import tmdbApi, { category, movieType } from "../../api/tmdbApi";
import "./hero-slide.scss";
import Button, { OutlineButton } from "../button/Button";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper";
import "swiper/css";
import Modal, { ModalContent } from "../modal/Modal";

const HeroSlide = (props) => {
    const [movieItems, setMovieItems] = useState([]);
    useEffect(() => {
        const getMovies = async () => {
            const params = { page: 1 };
            try {
                const response = await tmdbApi.getMoviesList(
                    movieType.popular,
                    { params }
                );
                setMovieItems(response.results.slice(1, 4));
                console.log(response);
            } catch (error) {
                console.log(error);
            }
        };
        getMovies();
    }, []);
    console.log(movieItems);
    return (
        <div className="hero-slide">
            <Swiper
                spaceBetween={0}
                slidesPerView={1}
                modules={[Autoplay]}
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false
                }}
            >
                {movieItems.map((item, i) => (
                    <SwiperSlide key={i}>
                        {({ isActive }) => (
                            <HeroSlideItem
                                item={item}
                                className={`${isActive ? "active" : ""}`}
                            />
                        )}
                    </SwiperSlide>
                ))}
            </Swiper>
            {movieItems.map((item, i) => (
                <TrailerModal key={i} item={item} />
            ))}
        </div>
    );
};
const HeroSlideItem = (props) => {
    let navigate = useNavigate();
    const item = props.item;
    const background = apiConfig.originalImage(
        item.backdrop_path ? item.backdrop_path : item.poster_path
    );
    const setModalActive = async () => {
        const modal = document.querySelector(`#modal_${item.id}`);
        const videos = await tmdbApi.getVideos(category.movie, item.id);
        if (videos.results.length > 0) {
            const videSrc =
                "https://www.youtube.com/embed/" + videos.results[0].key;
            modal
                .querySelector(".modal__content > iframe")
                .setAttribute("src", videSrc);
        } else {
            modal.querySelector(".modal__content").innerHTML = "No trailer";
        }

        modal.classList.toggle("active");
    };
    return (
        <div
            className={`hero-slide__item ${props.className}`}
            style={{ backgroundImage: `url(${background})` }}
        >
            <div className="hero-slide__item__content container">
                <div className="hero-slide__item__content__info">
                    <h2 className="title">{item.title}</h2>
                    <div className="overview">{item.overview}</div>
                    <div className="btns">
                        <Button onClick={() => navigate("/movie/" + item.id)}>
                            Watch now
                        </Button>
                        <OutlineButton onClick={setModalActive}>
                            Watch trailer
                        </OutlineButton>
                    </div>
                </div>
                <div className="hero-slide__item__content__poster">
                    <img src={apiConfig.w500Image(item.poster_path)} alt="" />
                </div>
            </div>
        </div>
    );
};
const TrailerModal = (props) => {
    const item = props.item;
    const iframeRef = useRef(null);

    const onClose = () => iframeRef.current.setAttribute("src", "");
    return (
        <Modal active={false} id={`modal_${item.id}`}>
            <ModalContent onClose={onClose}>
                <iframe
                    ref={iframeRef}
                    width="100%"
                    height="500px"
                    title="YouTube video player"
                ></iframe>
            </ModalContent>
        </Modal>
    );
};

export default HeroSlide;