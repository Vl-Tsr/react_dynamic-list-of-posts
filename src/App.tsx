/* eslint-disable @typescript-eslint/indent */
import cn from 'classnames';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './App.scss';
import { PostsList } from './components/PostsList';
import { PostDetails } from './components/PostDetails';
import { UserSelector } from './components/UserSelector';
import { Loader } from './components/Loader';
import { useEffect, useState } from 'react';
import { User } from './types/User';
import {
  deleteComment,
  getPostComments,
  getUserPosts,
  getUsers,
  postComment,
} from './API/services';
import { Post } from './types/Post';
import { Comment } from './types/Comment';
import { FormFields } from './types/FormFields';
import { FormErrors } from './types/FormErrors';

export const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUsersShown, setIsUsersShown] = useState(false);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [postComments, setPostComments] = useState<Comment[]>([]);
  const [isFormShown, setIsFormShown] = useState(false);

  const [isPostsLoading, setIsPostsLoading] = useState(false);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);

  const [hasCommentsError, setHasCommentsError] = useState(false);
  const [hasPostError, setHasPostError] = useState(false);

  const initFields: FormFields = {
    name: '',
    email: '',
    body: '',
  };

  const initFormErrors: FormErrors = {
    name: false,
    email: false,
    body: false,
  };

  const [formFiedls, setFormFields] = useState<FormFields>(initFields);
  const [formErrors, setFormErrors] = useState<FormErrors>(initFormErrors);

  const handleClearForm = (type: 'full' | 'part') => {
    setFormErrors(initFormErrors);

    switch (type) {
      case 'full':
        setFormFields(initFields);
        break;
      case 'part':
        setFormFields(prev => ({ ...prev, body: '' }));
        break;
    }
  };

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setFormErrors({
      name: !formFiedls.name,
      email: !formFiedls.email,
      body: !formFiedls.body,
    });

    if (!formFiedls.name || !formFiedls.email || !formFiedls.body) {
      return;
    }

    setIsFormLoading(true);

    try {
      const comment = await postComment({
        postId: selectedPost?.id || 0,
        name: formFiedls.name,
        email: formFiedls.email,
        body: formFiedls.body,
      });

      handleClearForm('part');
      setPostComments(prev => [...prev, comment]);
    } catch (error) {
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleSelectUser = async (user: User) => {
    setSelectedUser(user);
    setIsPostsLoading(true);
    setUserPosts([]);
    setSelectedPost(null);

    try {
      const data = await getUserPosts(user.id);

      setUserPosts(data);
    } catch (error) {
      setHasPostError(true);
    } finally {
      setIsPostsLoading(false);
    }
  };

  const handleOpenComments = async (id: number, post: Post) => {
    if (selectedPost?.id !== id) {
      setSelectedPost(post);
    } else {
      setSelectedPost(null);
    }

    setIsFormShown(false);
    setIsCommentsLoading(true);

    try {
      const data = await getPostComments(id);

      setPostComments(data);
    } catch (error) {
      setHasCommentsError(true);
    } finally {
      setIsCommentsLoading(false);
    }
  };

  const handleDeleteComment = async (id: number) => {
    try {
      await deleteComment(id);
      setPostComments(comments =>
        comments.filter(comment => comment.id !== id),
      );
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getUsers();

        setUsers(data);
      } catch (error) {}
    };

    loadUsers();
  }, []);

  return (
    <main className="section">
      <div className="container">
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile is-child box is-success">
              <div className="block">
                <UserSelector
                  users={users}
                  onSelectUser={handleSelectUser}
                  selectedUser={selectedUser}
                  onShowUsers={setIsUsersShown}
                  isUsersShown={isUsersShown}
                />
              </div>

              <div className="block" data-cy="MainContent">
                {!selectedUser && (
                  <p data-cy="NoSelectedUser">No user selected</p>
                )}
                {isPostsLoading && <Loader />}

                {hasPostError && (
                  <div
                    className="notification is-danger"
                    data-cy="PostsLoadingError"
                  >
                    Something went wrong!
                  </div>
                )}

                {selectedUser &&
                  !hasPostError &&
                  userPosts.length === 0 &&
                  !isPostsLoading && (
                    <div
                      className="notification is-warning"
                      data-cy="NoPostsYet"
                    >
                      No posts yet
                    </div>
                  )}

                {!!userPosts.length && (
                  <PostsList
                    userPosts={userPosts}
                    selectedPost={selectedPost}
                    onOpenComments={handleOpenComments}
                  />
                )}
              </div>
            </div>
          </div>

          <div
            data-cy="Sidebar"
            className={cn(
              'tile',
              'is-parent',
              'is-8-desktop',
              'Sidebar',
              selectedPost && 'Sidebar--open',
            )}
          >
            <div className="tile is-child box is-success ">
              {selectedPost && (
                <PostDetails
                  selectedPost={selectedPost}
                  hasCommentsError={hasCommentsError}
                  isCommentsLoading={isCommentsLoading}
                  postComments={postComments}
                  onWriteComment={setIsFormShown}
                  isFormShown={isFormShown}
                  isFormLoading={isFormLoading}
                  onSubmitForm={handleSubmitForm}
                  formFiedls={formFiedls}
                  onFieldsChange={setFormFields}
                  formErrors={formErrors}
                  onClearForm={handleClearForm}
                  onDeleteComment={handleDeleteComment}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
