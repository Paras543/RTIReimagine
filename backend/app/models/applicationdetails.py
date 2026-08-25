from app.db.base import Base
from sqlalchemy.orm import Mapped,mapped_column
from sqlalchemy import Integer,String,ForeignKey

class ApplicationDetails(Base):
    __tablename__ = "applicationdetails"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        exit= True
    )

    name: Mapped[str] = mapped_column(
        String(100)


    )
    email: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        index=True
    )

    mobileNumber: Mapped[int] = mapped_column(
        String(10),
        primary_key=True,
        unique=True,
        index=True
    )

    complete_address: Mapped[int] = mapped_column(
        String(100)
    )

    State: Mapped[str] = mapped_column(
        String(100)
    )

    District: Mapped[str] = mapped_column(
        String(100)

    )
    pincode: Mapped[int] = mapped_column(
        String(100)
    )

