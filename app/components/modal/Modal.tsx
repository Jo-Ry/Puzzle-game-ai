import { Dispatch, SetStateAction } from "react"

type ModalTypes = {
	setModal: Dispatch<SetStateAction<boolean>>
	initializeNewGame: () => void
}

const Modal = ({ setModal, initializeNewGame } : ModalTypes ) => {
	return (
		<div className="modal">
			<div className="modal__box">
				<span className="modal__box-emoji">&#128512;</span>
				<p>Gratulerar du vann, Vill du testa en till runda ?</p>
				<div className="modal__box-buttons">
					<button onClick={() => {
						setModal(false)
						initializeNewGame()
					}}>
						ja men absolut
					</button>
					<button onClick={() => setModal(false) }>
						nej tack
					</button>
				</div>
			</div>
		</div>
	)
}

export default Modal
