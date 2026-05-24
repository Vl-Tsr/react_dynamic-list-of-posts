import cn from 'classnames';
import React from 'react';
import { FormFields } from '../types/FormFields';
import { FormErrors } from '../types/FormErrors';

type Props = {
  isFormLoading: boolean;
  onSubmitForm: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  formFiedls: FormFields;
  onFieldsChange: React.Dispatch<React.SetStateAction<FormFields>>;
  formErrors: FormErrors;
  onClearForm: (type: 'full' | 'part') => void;
};

export const NewCommentForm: React.FC<Props> = ({
  isFormLoading,
  onSubmitForm,
  formFiedls,
  onFieldsChange,
  formErrors,
  onClearForm,
}) => {
  return (
    <form onSubmit={e => onSubmitForm(e)} data-cy="NewCommentForm">
      <div className="field" data-cy="NameField">
        <label className="label" htmlFor="comment-author-name">
          Author Name
        </label>

        <div className="control has-icons-left has-icons-right">
          <input
            value={formFiedls.name}
            onChange={e =>
              onFieldsChange(prev => ({ ...prev, name: e.target.value }))
            }
            type="text"
            name="name"
            id="comment-author-name"
            placeholder="Name Surname"
            className={cn('input', formErrors.name && 'is-danger')}
          />

          <span className="icon is-small is-left">
            <i className="fas fa-user" />
          </span>

          {formErrors.name && (
            <span
              className="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
            >
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>

        {formErrors.name && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Name is required
          </p>
        )}
      </div>

      <div className="field" data-cy="EmailField">
        <label className="label" htmlFor="comment-author-email">
          Author Email
        </label>

        <div className="control has-icons-left has-icons-right">
          <input
            value={formFiedls.email}
            onChange={e =>
              onFieldsChange(prev => ({ ...prev, email: e.target.value }))
            }
            type="text"
            name="email"
            id="comment-author-email"
            placeholder="email@test.com"
            className={cn('input', formErrors.email && 'is-danger')}
          />

          <span className="icon is-small is-left">
            <i className="fas fa-envelope" />
          </span>

          {formErrors.email && (
            <span
              className="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
            >
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>

        {formErrors.email && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Email is required
          </p>
        )}
      </div>

      <div className="field" data-cy="BodyField">
        <label className="label" htmlFor="comment-body">
          Comment Text
        </label>

        <div className="control">
          <textarea
            value={formFiedls.body}
            onChange={e =>
              onFieldsChange(prev => ({ ...prev, body: e.target.value }))
            }
            id="comment-body"
            name="body"
            placeholder="Type comment here"
            className={cn('textarea', formErrors.body && 'is-danger')}
          />
        </div>

        {formErrors.body && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Enter some text
          </p>
        )}
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button
            type="submit"
            className={cn('button', 'is-link', isFormLoading && 'is-loading')}
          >
            Add
          </button>
        </div>

        <div className="control">
          <button
            onClick={() => onClearForm('full')}
            type="reset"
            className="button is-link is-light"
          >
            Clear
          </button>
        </div>
      </div>
    </form>
  );
};
