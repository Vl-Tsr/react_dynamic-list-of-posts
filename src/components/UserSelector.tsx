import React from 'react';
import { User } from '../types/User';
import cn from 'classnames';

type Props = {
  users: User[];
  onSelectUser: (user: User) => Promise<void>;
  selectedUser: User | null;
  onShowUsers: React.Dispatch<React.SetStateAction<boolean>>;
  isUsersShown: boolean;
};

export const UserSelector: React.FC<Props> = ({
  users,
  onSelectUser,
  selectedUser,
  onShowUsers,
  isUsersShown,
}) => {
  return (
    <div
      data-cy="UserSelector"
      className={cn('dropdown', isUsersShown && 'is-active')}
    >
      <div className="dropdown-trigger">
        <button
          onClick={() => onShowUsers(true)}
          onBlur={() => onShowUsers(false)}
          type="button"
          className="button"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
        >
          <span>{selectedUser ? selectedUser.name : 'Choose a user'}</span>

          <span className="icon is-small">
            <i className="fas fa-angle-down" aria-hidden="true" />
          </span>
        </button>
      </div>

      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {users.map(user => (
            <a
              onMouseDown={() => onSelectUser(user)}
              key={user.id}
              href={`#user-${user.id}`}
              className={cn(
                'dropdown-item',
                selectedUser?.id === user.id && 'is-active',
              )}
            >
              {user.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
