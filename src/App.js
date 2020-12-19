import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { Checkbox } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';

import DeleteIcon from '@material-ui/icons/Delete';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

import { actions as postsActions } from './store/ducks/posts.duck';

import labelForButtons from './models/labelForButtons.js';
import './scss/index.scss';

//* Раз уж это тестовое задание позволю себе оставлять некоторые комментарии по коду
//* (некоторые === чуть более уточняющие (ну так на всякий))

//* Так же тут напишу непосредственно почему сделал через duck и зачем папка crud, когда cruda нет
//* Я привык думать наперёд, мне важно заранее знать о том, как я буду масштабировать код, а также,
//* Что не мало важно, как его будут понимать и масштабировать другие
//* Поэтому я прибегаю к duck паттерну(?) + это довольно удобно не нужно всё бить на 1000 папок
//* Crud пишу для всех операций с axios, люблю когда такой код где-то в другом месте
//* Чуть детальнее можно обсудить на интервью :) ток напомните

function App({
  liked,
  newPosts,

  loading,
  success,
  error,

  clearFetch,
  fetchRequest,

  likePost,

  delPost,
}) {
  //* Этот стейт чисто для драг н дропа (не нарушаем правила тз)
  const [myPosts, setMyPosts] = useState(newPosts);

  //* Фикс проблемы с перетаскиванием в драг н дропе
  const handleOnDragEnd = (drag) => {
    if (!drag.destination) return;
    const items = Array.from(myPosts);
    const [reorderedItem] = items.splice(drag.source.index, 1);
    items.splice(drag.destination.index, 0, reorderedItem);

    setMyPosts(items);
  }

  //* Я обхожу через мар именно myPosts из локального стейка из-за драг н дропа
  //* Поэтому тут при изменении newPosts (удалении) я обновляю и myPosts
  useEffect(() => {
    setMyPosts(newPosts);
  }, [newPosts]);

  useEffect(() => {
    if (success || error) clearFetch();
  }, [success, error, clearFetch]);

  return (
    <div className="wrapper">
      <div className="button-contain">
        {labelForButtons.map((item) => (
          <button
            className={`button-contain__item button-contain__item_${item.id} bounce-${item.id}`}
            key={item.id}
            onClick={() => fetchRequest(item.label)}>
            {item.label}
          </button>
        ))}
      </div>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="posts">
          {(provided) => (
            <div className="posts-contain" {...provided.droppableProps} ref={provided.innerRef}>
              {loading ? (
                <CircularProgress />
              ) : (
                myPosts.map((post, index) => (
                  <Draggable key={post.data.id} draggableId={post.data.id} index={index}>
                    {(provided) => (
                      <div
                        className="posts-contain__item"
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}>
                        <Checkbox
                          onChange={() => likePost()}
                          value={liked}
                          icon={<FavoriteBorderIcon />}
                          checkedIcon={<FavoriteIcon />}
                        />

                        <IconButton
                          size="small"
                          onClick={() => delPost(post.data.id)}
                          disabled={loading}>
                          <DeleteIcon />
                        </IconButton>

                        <a href={`https://www.reddit.com/${post.data.permalink}`} target="_blank">
                          {post.data.title}
                        </a>
                      </div>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

//* Использую коннектор, а не useSelector т.к. много чего надо вытаскивать из стейта
const connector = connect(
  (state) => ({
    liked: state.posts.liked,
    newPosts: state.posts.newPosts,

    loading: state.posts.loading,
    success: state.posts.success,
    error: state.posts.error,
  }),
  {
    clearFetch: postsActions.clearFetch,
    fetchRequest: postsActions.fetchRequest,

    likePost: postsActions.likePost,

    delPost: postsActions.delPost,
  },
);

export default connector(App);
