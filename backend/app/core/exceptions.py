class CustomerAlreadyExistsException(Exception):
    def __init__(self):
        self.message = "Customer with this email already exists."
        super().__init__(self.message)  