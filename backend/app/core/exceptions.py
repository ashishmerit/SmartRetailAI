from fastapi import HTTPException


class CustomerAlreadyExistsException(HTTPException):

    def __init__(self):

        super().__init__(

            status_code=409,

            detail="Customer with this email already exists."

        )


class CustomerNotFoundException(Exception):
    def __init__(self):
        self.message = "Customer not found."
        super().__init__(self.message)


class CustomerHasNoVisitException(Exception):
    def __init__(self):
        self.message = "Customer has not visited the store."
        super().__init__(self.message)