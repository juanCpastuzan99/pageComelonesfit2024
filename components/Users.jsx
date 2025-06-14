"use client";
import { useRouter } from "next/navigation";
import PropTypes from 'prop-types';

export default function Users({ users = [] }) {
    const router = useRouter();

    if (!users || users.length === 0) {
        return (
            <div className="alert alert-info">
                No hay usuarios disponibles
            </div>
        );
    }

    return (
        <div>
            <ul className="list-group">
                {users.map((user) => (
                    <li
                        key={user.id}
                        className="list-group-item d-flex justify-content-between align-items-center list-group-item-action"
                        onClick={() => router.push(`/users/${user.id}`)}
                    >
                        <div>
                            <h5>{user.id}</h5>
                            <p>{user.email}</p>
                        </div>
                        <img
                            src={user.avatar}
                            alt={user.email}
                            style={{ borderRadius: "50%" }}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}

Users.propTypes = {
    users: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            email: PropTypes.string.isRequired,
            avatar: PropTypes.string.isRequired,
        })
    ),
};