import React from 'react';
import { Loader } from './Loader';
import { NewCommentForm } from './NewCommentForm';
import { Post } from '../types/Post';
import { Comment } from '../types/Comment';
import { FormFields } from '../types/FormFields';
import { FieldErrors } from '../types/FieldErrors';

type Props = {
  selectedPost: Post;
  hasCommentsError: boolean;
  isCommentsLoading: boolean;
  postComments: Comment[];
  onWriteComment: React.Dispatch<React.SetStateAction<boolean>>;
  isFormShown: boolean;
  isFormLoading: boolean;
  onSubmitForm: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  formFiedls: FormFields;
  onFieldsChange: React.Dispatch<React.SetStateAction<FormFields>>;
  fieldErrors: FieldErrors;
  onClearForm: (type: 'full' | 'part') => void;
  onDeleteComment: (id: number) => Promise<void>;
  setFieldErrors: React.Dispatch<React.SetStateAction<FieldErrors>>;
};

export const PostDetails: React.FC<Props> = ({
  selectedPost,
  hasCommentsError,
  isCommentsLoading,
  postComments,
  onWriteComment,
  isFormShown,
  isFormLoading,
  onSubmitForm,
  formFiedls,
  onFieldsChange,
  fieldErrors,
  onClearForm,
  onDeleteComment,
  setFieldErrors,
}) => {
  return (
    <div className="content" data-cy="PostDetails">
      <div className="block">
        <h2 data-cy="PostTitle">
          #{selectedPost.id}: {selectedPost.title}
        </h2>

        <p data-cy="PostBody">{selectedPost.body}</p>
      </div>

      <div className="block">
        {isCommentsLoading && <Loader />}

        {hasCommentsError && (
          <div className="notification is-danger" data-cy="CommentsError">
            Something went wrong
          </div>
        )}

        {!isCommentsLoading && !postComments.length && !hasCommentsError && (
          <p className="title is-4" data-cy="NoCommentsMessage">
            No comments yet
          </p>
        )}

        {!isCommentsLoading && !hasCommentsError && (
          <>
            {postComments.length > 0 && <p className="title is-4">Comments:</p>}

            {postComments.map(comment => (
              <article
                key={comment.id}
                className="message is-small"
                data-cy="Comment"
              >
                <div className="message-header">
                  <a href={`mailto:${comment.email}`} data-cy="CommentAuthor">
                    {comment.name}
                  </a>
                  <button
                    onClick={() => onDeleteComment(comment.id)}
                    data-cy="CommentDelete"
                    type="button"
                    className="delete is-small"
                    aria-label="delete"
                  >
                    delete button
                  </button>
                </div>

                <div className="message-body" data-cy="CommentBody">
                  {comment.body}
                </div>
              </article>
            ))}

            {isFormShown && !hasCommentsError && (
              <NewCommentForm
                isFormLoading={isFormLoading}
                onSubmitForm={onSubmitForm}
                formFiedls={formFiedls}
                onFieldsChange={onFieldsChange}
                fieldErrors={fieldErrors}
                onClearForm={onClearForm}
                setFieldErrors={setFieldErrors}
              />
            )}

            {!isFormShown && !hasCommentsError && (
              <button
                onClick={() => onWriteComment(true)}
                data-cy="WriteCommentButton"
                type="button"
                className="button is-link"
              >
                Write a comment
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
