class CustomerAlreadyExistsException(Exception):
    def __init__(self):
        self.message = "Customer with this email already exists."
        super().__init__(self.message)


class CustomerNotFoundException(Exception):
    def __init__(self):
        self.message = "Customer not found."
        super().__init__(self.message)


class CustomerHasNoVisitException(Exception):
    def __init__(self):
        self.message = "Customer has not visited the store."
        super().__init__(self.message)